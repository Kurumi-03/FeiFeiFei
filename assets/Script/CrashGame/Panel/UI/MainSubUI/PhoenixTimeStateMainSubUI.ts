import { _decorator, Component, Node } from 'cc';
import MsgDispatcher from '../../../../Base/MsgDispatcher';
import { PhoenixGameEvent } from '../../../Event/PhoenixEvent';
import { CrashMainUI } from '../CrashMainUI';
const { ccclass, property } = _decorator;

@ccclass('PhoenixTimeStateMainSubUI')
export class PhoenixTimeStateMainSubUI extends Component {
    mainUI: CrashMainUI;
    setMainUI(mainUI: CrashMainUI) {
        this.mainUI = mainUI;
    }
    
    start() {
        MsgDispatcher.Register(PhoenixGameEvent.UPDATE_SECONDS_EVENT.toString(), this.onUpdateSeconds.bind(this));
        MsgDispatcher.Register(PhoenixGameEvent.UPDATE_BET_TIEMS_EVENT.toString(), this.onUpdateBetItems.bind(this));
  
    }

   onUpdateSeconds(data) {
        this.mainUI.view.txtPrepareTime.text = data+"s"
        this.mainUI.view.txtEndTime.text = data+"s"
    }

    onUpdateBetItems(data) {
        this.mainUI.view.txtProgressTime.text = data.toFixed(2)+"x"
    }

}
