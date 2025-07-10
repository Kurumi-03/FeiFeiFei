import { _decorator, Component, Node, Tween, Vec3, View,screen } from 'cc';
import MsgDispatcher from '../../Base/MsgDispatcher';
import { PhoenixGameEvent } from '../Event/PhoenixEvent';
import CrashGameBGHorizontalMoveComponent from '../Component/CrashGameBGHorizontalMoveComponent';
import { CrashGameState } from '../Enum/CrashGameState';
import { CrashGameApp } from '../CrashGameApp';
const { ccclass, property } = _decorator;

@ccclass('CrashBackgroundController')
export class CrashBackgroundController extends Component {
    @property(Node)
    background:Node | null = null;
    @property(CrashGameBGHorizontalMoveComponent)
    b0Ground:CrashGameBGHorizontalMoveComponent | null = null;
    @property(CrashGameBGHorizontalMoveComponent)
    b1Ground:CrashGameBGHorizontalMoveComponent | null = null;

    private m_verticalRate = 10;    //垂直的变化率
	private m_fogRate = -5;  //雾的变化率
	private m_distantRate = -3;  //远景的变化率
	private m_middleRate = -6;  //中景的变化率
	private m_closeShotRate = -10;  //近景的变化率
	private m_starRate = -30; //星球的变化率
	private m_starBgRate = -30; //星星的变化率
	private m_hSpeedRate = 0.2; //横向加速

    // 定义高度映射
    private kHeightMap = {
        Fog: 903 - this.getScreenScaleHeight(),   //  风		sp1
        Gate: 1400 - this.getScreenScaleHeight(),  //  南天门  sp2
        Roc: 2600 - this.getScreenScaleHeight(),  //  鲲   sp3
        Star: 3780 - this.getScreenScaleHeight(),  //  宇宙 sp3
    };

    // 定义计时器间隔
    private kTimerDt = 0.04;  //1秒25幀

    // 定义速度映射
    private kSpeedVMap = {
        "1": { maxH: this.kHeightMap.Fog, sp: -1.0 },
        "2": { maxH: this.kHeightMap.Gate, sp: -0.6 },
        "3": { maxH: this.kHeightMap.Roc, sp: -0.2 },
        "4": { maxH: this.kHeightMap.Star, sp: -0.1 },
    };

    
    private _originPos: Vec3 = new Vec3(0, 35, 0)
    private curBetTimes: number = 0;
    m_startFlyV: boolean;
    m_isToDown: boolean;
    m_verticalMaxY: number =35;
    m_verticalMinY: number = -5858;

    protected onLoad(): void {
        this.initGameEvent();

        this.m_verticalRate = 0;    // 垂直的变化率
        this.updateLandscape(this.b1Ground, 0);
        this.updateLandscape(this.b0Ground, 0);
    }

    initGameEvent() {
        MsgDispatcher.Register(PhoenixGameEvent.STATE_CHANGE_PREPARE_EVENT.toString(), this.onStateChangePrepare.bind(this));
        MsgDispatcher.Register(PhoenixGameEvent.STATE_CHANGE_START_EVENT.toString(), this.onStateChangeStart.bind(this));
        MsgDispatcher.Register(PhoenixGameEvent.STATE_CHANGE_PROGRESS_EVENT.toString(), this.onStateChangeProgress.bind(this));
        MsgDispatcher.Register(PhoenixGameEvent.STATE_CHANGE_END_EVENT.toString(), this.onStateChangeEnd.bind(this));

        MsgDispatcher.Register(PhoenixGameEvent.UPDATE_BET_TIEMS_EVENT.toString(), this.onUpdateBetItems.bind(this));
     }

    protected update(dt: number): void {
        this.updateTimer(dt);
    // this.background.setPosition(this._originPos.x, this._originPos.y-0, this._originPos.z);
    }

    private updateTimer(dt: number): void {
        if (this.m_verticalRate < 0 && this.m_startFlyV) 
        {
            // local val = GameRoomData.getInstance():getCurMultiple()
            // val = tonumber(val) or 0;

            // for (let i: number = 0; i < kRateConfig.length; i++) {
            //     let v: any = kRateConfig[i];
            //     if (val >= v.r1 && val < v.r2) {
            //         this.m_verticalRate = v.rate || this.m_verticalRate;
            //         break;
            //     }
            // }
            let cnt: number = Object.keys(this.kSpeedVMap).length;
            let bx: number = this.background.position.x;
            let by: number = this.background.position.y;
            for (let i: number = cnt; i >= 1; i--) {
                let t: any = this.kSpeedVMap[i.toString()];
                let posY: number = -t.maxH;

                if (by < posY) {
                    if (this.m_verticalRate !== t.sp) {
                        if (i === 1) {
                            this.onToFly1();
                        } else if (i === 2) {
                            this.onToFly2();
                        } else if (i === 3) {
                            this.onToFly3();
                        }
                    }
                    break;
                }
            }
        }

        this.updateBigBgPos();
        // this.updateLandscape("fog", this.m_fogRate);
       
        this.updateLandscape(this.b1Ground, this.m_distantRate);
        this.updateLandscape(this.b0Ground, this.m_middleRate);
        // this.updateLandscape("closeShot", this.m_closeShotRate);
        // this.updateStar();
    }

    private updateBigBgPos(): void {
        let bx: number = this.background.position.x;
        let by: number = this.background.position.y;
        let bgY: number = by + this.m_verticalRate;
        // bgY = Math.min(bgY, this.m_verticalMaxY);
        bgY = Math.max(bgY, this.m_verticalMinY);
        this.background.position = new Vec3(this.background.position.x, bgY, this.background.position.z);

        if (bgY <= this.m_verticalMinY) {
            this.m_starRate = Math.abs(this.m_verticalRate); //星球的变化率
            this.m_starBgRate = Math.abs(this.m_verticalRate) + 5; //星球的变化率
        }

        if (this.m_isToDown && bgY >= 0) {
            this.onToNormal();
            // EventDispatcher.getInstance().dispatch("onShowPhoenixReadyAnim");
        }
    }
        
    private updateLandscape(bg: CrashGameBGHorizontalMoveComponent | null, rate: number): void {
       

        bg.setMoveSpeed(rate,this.m_hSpeedRate);
    
        // let node: any = this[`m_${key}`];
    
        // if (node) {
        //     let w: number = node.getSize().width;
        //     let h: number = node.getSize().height;
        //     let x: number = node.getPos().x;
        //     let y: number = node.getPos().y;
        //     let curX: number = x + rate * this.m_hSpeedRate;
        //     if (curX < -w) {
        //         curX = w;
        //     }
    
        //     let imgRepeat: any = node.getChildByName("imgRepeat");
        //     if (imgRepeat) {
        //         let pX: number = (curX > 0) ? (-w + 1) : (w - 1);
        //         imgRepeat.setPos(pX);
        //     }
    
        //     node.setPos(curX);
        // }
    }
    
    onStartBetAnimEvent(){
        let pos =  this.background.position;
        if(pos.y <35){
             this.onToDown()
        }
        else{
            this.onToNormal()
        }
    }

    onStartFly(){
        this.m_verticalRate = -1;    // 垂直的变化率
        this.m_hSpeedRate = 7; //横向加速
    }

    onStopFly(){
        this.m_verticalRate = 0;    // 垂直的变化率
        this.m_hSpeedRate = 0; //横向加速
        this.m_starRate = 0;
        this.m_starBgRate = 0;
    }

    onToNormal(){
        this.m_verticalRate = 0;    //垂直的变化率
        this.m_fogRate = -5;  //雾的变化率
        this.m_distantRate = -3;  //远景的变化率
        this.m_middleRate = -6;  //中景的变化率
        this.m_closeShotRate = -10;  //近景的变化率
        this.m_starRate = -30; //星球的变化率
        this.m_starBgRate = -30; //星星的变化率
        this.m_hSpeedRate = 0.2; //横向加速
        this.m_isToDown = false
        this.m_startFlyV = false
    }

    onToDown(){
        this.m_startFlyV = false
        this.m_isToDown = true
        this.m_verticalRate = 40;    // 垂直的变化率
        this.m_hSpeedRate = 0; //横向加速
    }

    onToFly1(){
        this.m_verticalRate = this.kSpeedVMap[1].sp;    // 垂直的变化率
        this.m_hSpeedRate = 4; //横向加速
        MsgDispatcher.Send("onBgSpeedChangeEvent", 1)
    }

    onToFly2(){
        this.m_verticalRate = this.kSpeedVMap[2].sp
        this.m_hSpeedRate = 5; //横向加速
        MsgDispatcher.Send("onBgSpeedChangeEvent", 2)
    }

    onToFly3(){
        this.m_verticalRate = this.kSpeedVMap[3].sp
        this.m_hSpeedRate = 6; //横向加速
        //this.m_starRate = 5; //星球的变化率
        //this.m_starBgRate = 15; //星星的变化率
        MsgDispatcher.Send("onBgSpeedChangeEvent", 3)
    }
    public onStartShowFlyAnimEvent(info: any): void {
        this.onStartFly();
        this.m_startFlyV = true;
        if (info && info.flyTime && info.flyTime - 9 > 0) {
            
            let moveH: number = 0;
            let flyTime: number = info.flyTime - 5;  // 9秒时平滑时间
            let curMultiple: number = Number(info.curMultiple);
            let cnt: number = Object.keys(this.kSpeedVMap).length;
            for (let i: number = 0; i < cnt; i++) {
                let secGap: number = 1 / this.kTimerDt * this.kSpeedVMap[i].sp;  // 每秒上升高度(负数)
                let costTime: number = Math.abs(this.kSpeedVMap[i].maxH / secGap);
    
                if (costTime < flyTime) {
                    flyTime = flyTime - costTime;
                    moveH = -this.kSpeedVMap[i].maxH;
                } else {
                    moveH = moveH + secGap * flyTime;
                    break;
                }
            }
    
            if (moveH < 0) {
                let bgY: number = moveH;
                bgY = Math.min(bgY, this.m_verticalMaxY);
                bgY = Math.max(bgY, this.m_verticalMinY);
                this.background.position = new Vec3(this.background.position.x, bgY, this.background.position.z);
            }
        }
    }
    
    public onFlySpeed1(): void {
        this.m_startFlyV = true;
        this.onToFly1();
    }

    onUpdateBetItems(betTimes)
    {
        // this.b0Ground.moveSpeed = 400+betTimes*100;
        // this.b1Ground.moveSpeed = 200+betTimes*100;

        // this.curBetTimes = betTimes;
    }

    onStateChangePrepare() {
        this.onStartBetAnimEvent();
        // this.b0Ground.moveSpeed = 300;
        // this.b1Ground.moveSpeed = 150;
    }

    onStateChangeStart() {
        
        // this.b0Ground.moveSpeed = 400;
        // this.b1Ground.moveSpeed = 200;
    }

    onStateChangeProgress(betTimes) {
        this.onStartShowFlyAnimEvent(null);
        // this.onStartBetAnimEvent();
    }

    onStateChangeEnd() {
        this.m_verticalRate = 0;    // 垂直的变化率
        this.m_hSpeedRate = 0; //横向加速

        this.m_distantRate = 0;  //远景的变化率
        this.m_middleRate = 0;  //中景的变化率
        // this.b0Ground.moveSpeed = 300;
        // this.b1Ground.moveSpeed = 150;
        // this.b0Ground.stopScrolling();
        // this.b1Ground.stopScrolling();
        // this.backgroundMoveAnim(this.background, 2);
    }

    backgroundMoveAnim(T: Node, second: number = 0.3) {
        T.active = true;
        new Tween(T)
            .to(second, {
                position: this._originPos,
            })
            .delay(0.3)
            .start()
    }

    getScreenScaleHeight()
    {
        return screen.windowSize.height;
    }
}
