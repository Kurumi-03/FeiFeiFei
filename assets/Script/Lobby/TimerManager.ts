/**
 * 更加精確的計時器
 */
import { Component, director, _decorator } from "cc";
const { ccclass, property } = _decorator;
const guid = function () {
    let guid: string = "";
    for (let i = 1; i <= 32; i++) {
        let n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }
    return guid;
}
@ccclass('TimerManager')
export class TimerManager extends Component {
    private times: any = {};
    private schedules: any = {};
    private _scheduleCount: number = 1;
    private initTime: number = (new Date()).getTime();      // 當前遊戲進入的時間毫秒值
    private static _instance = null;
    // 伺服器時間與本地時間間隔
    private _$serverTimeElasped: number = 0;
    public static Instance() {
        if (this._instance == null) {
            return;
        }
        return this._instance;
    }
    protected onLoad(): void {
        TimerManager._instance = this;
        director.addPersistRootNode(TimerManager._instance.node);
        TimerManager.Instance().scheduleSelf(TimerManager._instance.onUpdate, 1 / 60);
    }
    /**
     * 設定伺服器時間與本地時間間隔
     * @param val
     */
    public serverTimeElasped(val?: number): number {
        if (val) {
            TimerManager._instance._$serverTimeElasped = val;
        }
        return TimerManager._instance._$serverTimeElasped;
    }
    /**
     * 格式化日期顯示 format= "yyyy-MM-dd hh:mm:ss";
     * @param format
     * @param date
     */
    /** 獲取遊戲開始到現在逝去的時間 */
    public getTime(): number {
        return TimerManager._instance.getLocalTime() - TimerManager._instance.initTime;
    }
    /** 獲取本地時間刻度 */
    public getLocalTime(): number {
        return Date.now();
    }
    public scheduleSelf(callback: Function, interval: number, repeat: number = 0): string {
        let UUID = `schedule_${TimerManager._instance._scheduleCount++}`
        TimerManager._instance.schedules[UUID] = callback;
        if (repeat == 0) {
            TimerManager.Instance().schedule(callback, interval);
        } else {
            TimerManager.Instance().schedule(callback, interval, repeat);
        }
        return UUID;
    }
    public scheduleOnceSelf(callback: Function, delay: number = 0): string {
        let UUID = `scheduleOnce_${TimerManager._instance._scheduleCount++}`;
        TimerManager._instance.schedules[UUID] = callback;
        TimerManager.Instance().scheduleOnce(() => {
            let cb = TimerManager._instance.schedules[UUID];
            if (cb) {
                cb();
            }
            TimerManager._instance.unschedule(UUID);
        }, Math.max(delay, 0));
        return UUID;
    }
    public unscheduleSelfAll(){
        TimerManager.Instance().unscheduleAllCallbacks();
    }
    public unscheduleSelf(uuid: string) {
        let cb = TimerManager._instance.schedules[uuid];
        if (cb) {
            TimerManager.Instance().unschedule(cb);
            delete TimerManager._instance.schedules[uuid];
        }
    }
    onUpdate(dt: number) {
        // 後台管理倒計時完成事件
        for (let key in TimerManager.Instance().times) {
            let data = TimerManager.Instance().times[key];
            data.update(dt);
        }
    }
    /** 遊戲最小化時記錄時間數據 */
    public save() {
        for (let key in TimerManager.Instance().times) {
            TimerManager.Instance().times[key].recordTime = TimerManager._instance.getTime();
        }
    }
    /** 遊戲最大化時恢復時間數據 */
    public load() {
        for (let key in TimerManager.Instance().times) {
            let data: Timer = TimerManager.Instance().times[key];
            if (data.isSaveTime) {
                // 經過了多少時間，單位為秒
                let interval = ((TimerManager._instance.getTime() - (data.recordTime || TimerManager._instance.getTime())) / 1000);
                let overTimes = interval / data.step;
                data.curTimes = data.curTimes + overTimes;
                if (data.curTimes > data.totalTime) {
                    if (data.onDelayCompleteCallback) {
                        data.onDelayCompleteCallback.call(data.object);                     // 觸發超時回調事件  
                    }
                }
            }
            data.recordTime = 0;
        }
    }
    public getTimer(id: string): Timer {
        if (TimerManager.Instance().times[id])
            return TimerManager.Instance().times[id];
        return null;
    }
    /**
     * 註冊指定對象的倒計時屬性更新
     * @param object 回調對象
     * @param step 時間間隔
     * @param totalTime 執行次數（n+1次）
     * @param onStepCallback 執行回調
     * @param onDelayCompleteCallback 超時回調
     * @param isSaveTime 是否保存切後台時間
     * @returns
     */
    public addTimer(object: any, step: number, totalTime: number = -1, onStepCallback: Function, onDelayCompleteCallback?: Function, isSaveTime: boolean = false) {
        let data: Timer = new Timer(step, totalTime, onStepCallback, object, isSaveTime);
        data.id = guid();
        data.onDelayCompleteCallback = onDelayCompleteCallback; // 超時完成事件
        TimerManager.Instance().times[data.id] = data;
        return data.id;
    }
    /** 注銷指定對象的倒計時屬性更新 */
    public clearTimer(id: string) {
        if (TimerManager.Instance().times[id])
            delete TimerManager.Instance().times[id];
    }
}
/** 定時跳動組件 */
export class Timer {
    public id: string
    public onStepCallback: Function | null = null;
    public onDelayCompleteCallback: Function | null = null;
    public object: any | null = null;
    public totalTime: number = -1;//總次數，-1為無限
    public recordTime: number = 0;//某個時間點保存的時間
    public curTimes: number = 0;//當期觸發次數
    public isSaveTime: boolean = false;//是否記錄切後台時間
    private _elapsedTime: number = 0;
    private _isStop: boolean = false;
    public get elapsedTime(): number {
        return this._elapsedTime;
    }
    private _step: number = 0;
    /** 觸發間隔時間（秒） */
    get step(): number {
        return this._step;
    }
    set step(step: number) {
        this._step = step;                     // 每次修改時間
        this._elapsedTime = 0;                 // 逝去時間
    }
    public get progress(): number {
        return this._elapsedTime / this._step;
    }
    /**
     *
     * @param step 時間間隔
     * @param totalTimes 總次數，-1為無限
     * @param callback 回調
     * @param object 回調者
     */
    constructor(step: number = 0, totalTimes: number = -1, callback?: Function, object?: any, isSaveTime?: boolean) {
        this.step = step;
        this.onStepCallback = callback;
        this.object = object;
        this.totalTime = totalTimes;
        this.curTimes = 0;
        this.isSaveTime = isSaveTime;
        this.onStepCallback?.call(this.object, this.curTimes, (this.totalTime - this.curTimes));
    }
    public update(dt: number) {
        if (this._isStop) {
            return;
        }
        this._elapsedTime += dt;
        if (this._elapsedTime >= this._step) {
            this._elapsedTime -= this._step;
            if (this.totalTime == -1) {
                this.onStepCallback?.call(this.object);
                return true;
            } else {
                if (this.curTimes < this.totalTime) {
                    this.curTimes++;
                    this.onStepCallback?.call(this.object, this.curTimes, (this.totalTime - this.curTimes));
                    return true;
                }
            }
            return false;
        }
        return false;
    }
    // 重置計時器
    public reset(step?: number, totalTimes?: number) {
        this._elapsedTime = 0;
        this.curTimes = 0;
        if (step) {
            this.step = step;
        }
        if (totalTimes) {
            this.totalTime = totalTimes;
        }
    }
    public isStop() {
        return this._isStop;
    }
    // 停止
    public stop() {
        this._isStop = true;
        this.reset();
    }
    // 開始
    public start() {
        this._isStop = false;
        this.reset();
    }
    // 暫停
    public pause() {
        this._isStop = true;
    }
    // 恢復
    public resume() {
        this._isStop = false;
    }
}