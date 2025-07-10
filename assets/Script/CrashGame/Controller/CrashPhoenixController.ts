import { _decorator, Component, instantiate, math, Node, sp, Tween, Vec3, View,screen } from 'cc';
import MsgDispatcher from '../../Base/MsgDispatcher';
import { PhoenixGameEvent } from '../Event/PhoenixEvent';
import { TimerManager } from '../../Lobby/TimerManager';
import PhoenixGameConfig from '../Config/PhoenixGameConfig';
import { CrashGameApp } from '../CrashGameApp';
import { CrashGameState } from '../Enum/CrashGameState';
import { PhoenixGameNetManager } from '../Net/PhoenixGameNetManager';
import { AudioMgr } from '../../Base/AudioMgr';
const { ccclass, property,executeInEditMode } = _decorator;

@ccclass('CrashPhoenixController')
// @executeInEditMode(true)
export class CrashPhoenixController extends Component {
    @property(Node)
    objPhoenix:Node | null = null;
    @property(Node)
    objEgg:Node | null = null;

    @property(sp.Skeleton)
    SKPhoenix:sp.Skeleton | null = null;
    @property(sp.Skeleton)
    SKStart:sp.Skeleton | null = null;
    @property(sp.Skeleton)
    SKEgg:sp.Skeleton | null = null;
    @property(sp.Skeleton)
    SKFeather:sp.Skeleton | null = null;

    @property(Node)
    objPosNode:Node | null;
    private _featherAniIndex: number;
    private _featherAniInterval: number;
    private _currentAniInterval: number;

    private _phoenixPos = new Vec3(0, 0, 0);

    kPhoenixAnimMap = [
        {sf:1, ef:24, poss:10, pose:66},
        {sf:25, ef:217, poss:66, pose:99},
        {sf:218, ef:337, poss:99, pose:119},
        {sf:338, ef:417, poss:119, pose:138},
        {sf:418, ef:537, poss:138, pose:138},
    ]
    progressFrameCount: number;
    curFitYRate: number;
    curFitXRate: number;
    testNodeList=[];

    protected onLoad(): void {
        var screenHeight = screen.windowSize.height;
        var screenWidth = screen.windowSize.width;
        var designHeight = 585; 
        var designWidth = 1280; 
        var rateH = screenHeight/designHeight;
        var rateW = screenWidth/designWidth;
        // var screenRateW = (screenWidth-210/designWidth*screenWidth)/1007/designWidth*screenWidth;
        // var screenRateH = (screenHeight-110/designHeight*screenHeight)/474/designHeight*screenHeight;

        var screenRateH = 0.75;
        var screenRateW = 0.85;

        this.curFitXRate = screenRateW;
        this.curFitYRate = screenRateH;
        this.initGameEvent();
        // this.testPosLine();
    }

    testPosLine() {
        this.objPosNode.active = false;
        let posArr = PhoenixGameConfig.FlyLinePosArr;
        

        for(let i=0;i<this.testNodeList.length;i++)
        {
            let node = this.testNodeList[i];
            node.destroy();
        }

        this.testNodeList = [];
        for(let i=0;i<posArr.length;i++)
        {
            let pos = posArr[i];
            let node = instantiate(this.objPosNode);
            node.parent = this.objPosNode.parent;

            this._phoenixPos.x = pos.x*this.curFitXRate;
            this._phoenixPos.y = pos.y*this.curFitYRate;
            node.position =  this._phoenixPos;
            node.active = true;
            this.testNodeList.push(node);
        }
    }

    initGameEvent() {
        MsgDispatcher.Register(PhoenixGameEvent.STATE_CHANGE_PREPARE_EVENT.toString(), this.onStateChangePrepare.bind(this));
        MsgDispatcher.Register(PhoenixGameEvent.STATE_CHANGE_START_EVENT.toString(), this.onStateChangeStart.bind(this));
        MsgDispatcher.Register(PhoenixGameEvent.STATE_CHANGE_PROGRESS_EVENT.toString(), this.onStateChangeProgress.bind(this));
        MsgDispatcher.Register(PhoenixGameEvent.STATE_CHANGE_END_EVENT.toString(), this.onStateChangeEnd.bind(this));

        MsgDispatcher.Register(PhoenixGameEvent.UPDATE_BET_TIEMS_EVENT.toString(), this.onUpdateBetItems.bind(this));
     }

     protected update(dt: number): void {
         if(this.objPhoenix.active)
         {
            this._currentAniInterval+=dt;
            if(this._currentAniInterval>this._featherAniInterval)
            {
                this._currentAniInterval = 0;
                this.playFeatherAnimation();
            }
         }

         if(CrashGameApp.Instance().getCurGameState()==CrashGameState.StartShowdown)
         {
            this.progressFrameCount++;
            let pos = this.getLinePosByFrame(this.progressFrameCount);
            if(pos==null)return;
            this._phoenixPos.x = pos.x*this.curFitXRate;
            this._phoenixPos.y = pos.y*this.curFitYRate;

            this.objPhoenix.position = this._phoenixPos;
            this.objEgg.position = this._phoenixPos;

            this.rotatePhoenixByFrames();
         }
         else
         {
            this.progressFrameCount=0;
         }
     }

    rotatePhoenixByFrames()
    {
        let frame = this.progressFrameCount;
        let totalFrame = 537/24*60;
        let rate = frame/totalFrame;
        let angle = 85*rate;
        angle = Math.min(angle, 85)
        this.objPhoenix.eulerAngles = new Vec3(0, 0, angle);
    }

    lerp(a:number, b:number, t:number) {
        return a + (b - a) * t;
    }

     playFeatherAnimation()
     {
        this.SKFeather.setAnimation(0, "feather"+this._featherAniIndex, false);
     }

     onUpdateBetItems(betTimes)
     {
        this.caculateFeatherAniConfig(betTimes);
     }

     caculateFeatherAniConfig(betTimes)
     {
        var index= Math.floor(betTimes);
        if(index<5)
        {
            this._featherAniInterval = 7
            this._featherAniIndex = 1;
        }
        else if(index<10)
        {
            this._featherAniInterval = 5
            this._featherAniIndex = 2;
        }
        else{
            this._featherAniInterval = 2
            this._featherAniIndex = 3;
        }
     }

    onStateChangePrepare() {
        
        this.objEgg.position = new Vec3(0, 0, 0);
        this.objPhoenix.position = new Vec3(0, 0, 0);
        this.objPhoenix.eulerAngles = new Vec3(0, 0, 0);
        this.objPhoenix.active = false;
        this.objEgg.active = true;
        
        this.SKEgg.setAnimation(0, "idle", true);
    }

    onStateChangeStart() {
        this.SKEgg.setAnimation(0, "start", false);
    }

    onStateChangeProgress(betTimes) {
        if(!this.objPhoenix.active)
        {
            this.SKStart.setAnimation(0, "animation", false);
        }
        this.objPhoenix.active = true;
        this.objEgg.active = false;
    }

    onStateChangeEnd() {
        this.objPhoenix.active = false;
        this.objEgg.active = true;
        if(PhoenixGameNetManager.Instance(PhoenixGameNetManager).getCurRoundRate()>0)
        {
            this.SKEgg.setAnimation(0, "die", false);
        }
    }

    getLinePosByFrame(frame)
    {
        frame = Math.floor(frame/2);
        let posArr = PhoenixGameConfig.FlyLinePosArr;
        for (const key in this.kPhoenixAnimMap) {
            const v = this.kPhoenixAnimMap[key];
            let startFrame = Math.floor(v.sf/24*60)
            let endFrame = Math.floor(v.ef/24*60)
            if (frame >= startFrame && frame <= endFrame)
            {
                if(v.poss==v.pose)
                {
                    return posArr[v.poss]
                }
                else
                {
                    let fnum = endFrame - startFrame
					let gap = (v.pose - v.poss) /fnum  // 每帧可加多少下标
                    if(gap>0.5)//位置多于帧数，直接返回最后一帧
                    {
                        let addGap = (frame - startFrame) * gap
                        let index = Math.floor(v.poss + addGap)
                        index = Math.min(index, v.pose)

                        return posArr[index]
                    }
                    else{//位置少于帧数，需要插值
                        let framePerPos = fnum/(v.pose - v.poss)
                        let addPos = (frame - startFrame) * gap
                        let index = Math.floor(v.poss + addPos)
                        index= Math.min(index, posArr.length-1)
                        let pos1 = posArr[index]
                        let pos2 = posArr[index]
                        let posX = pos1.x;
                        let posY = pos1.y;
                        if(index+1<posArr.length)
                        {
                            pos2 = posArr[index+1]
                            let t = (frame - (startFrame+(index-v.poss)*framePerPos)) / framePerPos
                            posX = this.lerp(pos1.x, pos2.x, t)
                            posY = this.lerp(pos1.y, pos2.y, t)
                        }
                       
                        let pos = new Vec3(posX, posY, 0)
                        return pos
                    }
					
                }
            }
        }
        return null;
    }

    getPosFrameMoveRate(frame)
    {
        for (const key in this.kPhoenixAnimMap) {
            const v = this.kPhoenixAnimMap[key];
            let startFrame = v.sf/24*60
            let endFrame = v.ef/24*60
            if (frame >= startFrame && frame <= endFrame)
            {
                let fnum = endFrame - startFrame
                let rate = fnum/(v.pose - v.poss)  // 每帧可加多少下标

                rate = Math.floor(rate)
                rate = Math.max(1, rate)
                return {startFrame:startFrame, endFrame:endFrame, rate:rate}
            }
        }
        return {startFrame:frame, endFrame:frame, rate:1}
    }
}
