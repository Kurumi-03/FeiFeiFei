import { _decorator, Component, Node } from 'cc';
import CrashGameFMSManager from './CrashGameFMSManager';
export default class CrashGameFMSState {
    // 状态ID
    StateID: number = -1;
    // 所属的状态拥有者
    stateComponent: Component;
    // 所属的状态管理器
    fsmManager: CrashGameFMSManager = null;

    constructor(StateID: number, stateComponent: Component, fsmManager: CrashGameFMSManager) {
        this.StateID = StateID;
        this.stateComponent = stateComponent;
        this.fsmManager = fsmManager;
    }
    // 进入状态
    OnEnter(data: any) { }
    // 状态更新
    OnUpdate(dt: number) { }

}