import { _decorator, Component, Node } from 'cc';
import { CrashMainUI } from '../CrashMainUI';
import { PhoenixGameNetManager } from '../../../Net/PhoenixGameNetManager';
import MsgDispatcher from '../../../../Base/MsgDispatcher';
import { PhoenixGameEvent } from '../../../Event/PhoenixEvent';
const { ccclass, property } = _decorator;

@ccclass('PhoenixPlayerInfoMainSubUI')
export class PhoenixPlayerInfoMainSubUI extends Component {
    mainUI: CrashMainUI;
    setMainUI(mainUI: CrashMainUI) {
        this.mainUI = mainUI;
    }

    protected start(): void {
        
      MsgDispatcher.Register(PhoenixGameEvent.UPDATE_PLAYER_INFO_EVENT.toString(),this.onUpdatePlayerInfoEvnt.bind(this));
    }
    
    onUpdatePlayerInfoEvnt(data)
    {
       this.updatePlayerInfo();
    }

    updatePlayerInfo() {
        this.mainUI.view.txtMyNickname.string = PhoenixGameNetManager.Instance(PhoenixGameNetManager).myPlayerInfo.NickName;
        this.mainUI.view.txtMyMoney.string = PhoenixGameNetManager.Instance(PhoenixGameNetManager).myPlayerInfo.GPoints.toLocaleString();
    }
}
