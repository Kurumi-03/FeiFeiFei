import { _decorator, Component, Node } from 'cc';
import CrashGameFMSState from './CrashGameFMSState';
import { CrashGameState } from '../Enum/CrashGameState';
import { PhoenixGameEvent } from '../Event/PhoenixEvent';
import MsgDispatcher from '../../Base/MsgDispatcher';
import { AudioMgr } from '../../Base/AudioMgr';
export default class CrashGameEndState extends CrashGameFMSState {
    private _endeTime: number = 4;
    private _lastSecond: number = 0;
    // 进入状态
    OnEnter(data: any) {
        AudioMgr.Instance(AudioMgr).playOneShot("aud_crash");
        MsgDispatcher.Send(PhoenixGameEvent.STATE_CHANGE_END_EVENT.toString(),data);
        this._endeTime = data;
    }
    // 状态更新
    OnUpdate(dt: number) {
        if(this._endeTime<=0)return;

        this._endeTime -= dt;
        var seconds = Math.floor(this._endeTime);
        if(seconds<0)
        {
            seconds = 0;
        }

        if(seconds!=this._lastSecond)
        {
            this._lastSecond = seconds;
            MsgDispatcher.Send(PhoenixGameEvent.UPDATE_SECONDS_EVENT.toString(),seconds);
        }

        if(this._endeTime <= 0)
        {
            this._lastSecond = 0;
            // this._endeTime = 4;
            // this.fsmManager.changeState(CrashGameState.PREPARE);
        }
    }
}