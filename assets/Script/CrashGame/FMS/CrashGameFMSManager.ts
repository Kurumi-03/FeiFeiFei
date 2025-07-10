import { _decorator, Component, Node } from 'cc';
import CrashGameFMSState from './CrashGameFMSState';
import { Progarm } from '../../Base/Progarm';
export default class CrashGameFMSManager  {
    // 状态列表
    stateList: CrashGameFMSState[] = [];
    // 当前状态ID
    currentID: number = -1;

    // 改变状态
    changeState(stateID: number,data: any=null) {
        Progarm.log("FMSManager changeState stateID:" + stateID);
        this.currentID = stateID;
        // 调用新状态id的enter方法
        this.stateList[this.currentID].OnEnter(data);
    }

    // 更新调用
    OnUpdate(dt: number) {
        if (this.currentID != -1) { this.stateList[this.currentID].OnUpdate(dt); }
    }
}