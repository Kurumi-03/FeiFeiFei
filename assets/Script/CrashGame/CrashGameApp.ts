import { _decorator, AudioClip, Component, Node } from 'cc';
import FSMManager from './FMS/CrashGameFMSManager';
import CrashGamePrepareState from './FMS/CrashGamePrepareState';
import CrashGameStartState from './FMS/CrashGameStartState';
import CrashGameProgressState from './FMS/CrashGameProgressState';
import CrashGameEndState from './FMS/CrashGameEndState';
import { CrashGameState } from './Enum/CrashGameState';
import { PhoenixGameNetManager } from './Net/PhoenixGameNetManager';
import { AudioMgr } from '../Base/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('CrashGameApp')
export class CrashGameApp extends Component {
    public crashEventTarget:EventTarget = new EventTarget();

    private fsmManager: FSMManager;
    private stateClassArr = [
        CrashGamePrepareState,
        CrashGameStartState,
        CrashGameProgressState,
        CrashGameEndState,
    ]


    private static _instance:CrashGameApp = null;
    dataMamager: any;

    public static Instance() {
        if (this._instance == null) {
            return;
        }
        return this._instance;
    }

    public getCurGameState()
    {
        return this.fsmManager.currentID;
    }

    onLoad(){
        CrashGameApp._instance = this;

        this.fsmManager = new FSMManager();
        this.dataMamager = PhoenixGameNetManager.Instance(PhoenixGameNetManager);
        this.dataMamager.init();
        
        for(let i in CrashGameState) {
            let index = Number(i);
            if (!isNaN(index)) {
                this.fsmManager.stateList.push(new this.stateClassArr[index](index, this, this.fsmManager));
            }
        }

    }

    chageState(stateID: number, data: any = null) {
        this.fsmManager.changeState(stateID, data);
    }
    
    update(deltaTime: number) {
        this.fsmManager.OnUpdate(deltaTime);
    }
}


