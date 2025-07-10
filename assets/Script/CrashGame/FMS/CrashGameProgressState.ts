import { _decorator, Component, math, Node } from 'cc';
import CrashGameFMSState from './CrashGameFMSState';
import { CrashGameState } from '../Enum/CrashGameState';
import { PhoenixGameEvent } from '../Event/PhoenixEvent';
import MsgDispatcher from '../../Base/MsgDispatcher';
import { PhoenixGameNetManager } from '../Net/PhoenixGameNetManager';
import { AudioMgr } from '../../Base/AudioMgr';
export default class CrashGameProgressState extends CrashGameFMSState {
    private _finalBetTimes: number = 6;
    private _progress: number = 1;
    private _progressStep: number = 0.0001;
    private _lastProgress: number =0;
    private _startTime: number = 0;
    _initial;
    // 进入状态
    OnEnter(data: any) {
        AudioMgr.Instance(AudioMgr).playOneShot("aud_transform");
        
        AudioMgr.Instance(AudioMgr).playOneShot("aud_phoenix_shout");
        
        MsgDispatcher.Send(PhoenixGameEvent.STATE_CHANGE_PROGRESS_EVENT.toString());

        this._startTime = data.StartTime;
        this._progress = data.Initial;
        this._initial = data.Initial;
        this._progressStep= data.Factor*16;
    }
    // 状态更新
    OnUpdate(dt: number) { 
        
        var curNotifyGameState= PhoenixGameNetManager.Instance(PhoenixGameNetManager).curNotifyGameState;
        if(curNotifyGameState==null)return;
        
        if(curNotifyGameState.GameOver)
        {
            this._progress = curNotifyGameState.CurrentMultiplier;
        }
        else
        {
            this._progress += this._progressStep;
            if(this._progress>curNotifyGameState.CurrentMultiplier)
            {
                this._progress=curNotifyGameState.CurrentMultiplier;
            }
        }

        this._lastProgress = this._progress;
        MsgDispatcher.Send(PhoenixGameEvent.UPDATE_BET_TIEMS_EVENT.toString(), this._progress)
    }

}