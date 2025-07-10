import { _decorator, Component, Node } from 'cc';
import CrashGameFMSState from './CrashGameFMSState';
import { CrashGameState } from '../Enum/CrashGameState';
import MsgDispatcher from '../../Base/MsgDispatcher';
import { PhoenixGameEvent } from '../Event/PhoenixEvent';
import { AudioMgr } from '../../Base/AudioMgr';
export default class CrashGamePrepareStates extends CrashGameFMSState {
    private _maxPrepareTime: number = 14;
    private _prepareTime: number = 0;
    private _lastSecond:number = 0;
    // 进入状态
    OnEnter(data: any) {
       
        MsgDispatcher.Send(PhoenixGameEvent.STATE_CHANGE_PREPARE_EVENT.toString());
        this._prepareTime = data;//this._maxPrepareTime;
    }
    // 状态更新
    OnUpdate(dt: number) {
        if(this._prepareTime<=0)return;

        this._prepareTime -= dt;
        var seconds = Math.floor(this._prepareTime);
        if(seconds<0)
        {
            seconds = 0;
        }

        if(seconds!=this._lastSecond)
        {
            this._lastSecond = seconds;
            
            if(this._lastSecond<=10)AudioMgr.Instance(AudioMgr).playOneShot("aud_clock");
            MsgDispatcher.Send(PhoenixGameEvent.UPDATE_SECONDS_EVENT.toString(),seconds);
        }
        if(this._prepareTime <= 0)
        {
            this._lastSecond = 0;
            // this._prepareTime = this._maxPrepareTime;
            // this.fsmManager.changeState(CrashGameState.START);
        }
    }
}