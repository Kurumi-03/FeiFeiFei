import { _decorator, Component, Node } from 'cc';
import CrashGameFMSState from './CrashGameFMSState';
import { CrashGameState } from '../Enum/CrashGameState';
import MsgDispatcher from '../../Base/MsgDispatcher';
import { PhoenixGameEvent } from '../Event/PhoenixEvent';
export default class CrashGameStartState extends CrashGameFMSState {
    private _startTime: number = 0.5;
    // 进入状态
    OnEnter(data: any) {
        MsgDispatcher.Send(PhoenixGameEvent.STATE_CHANGE_START_EVENT.toString());
        this._startTime = 0.5;
    }
    // 状态更新
    OnUpdate(dt: number) {
        this._startTime -= dt;
        if(this._startTime <= 0)
        {
            this._startTime = 0.5;
            // this.fsmManager.changeState(CrashGameState.PROGRESS,null);
        }
    }
}