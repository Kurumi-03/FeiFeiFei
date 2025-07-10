import { _decorator, Component, Node } from 'cc';
import { CrashMainUI } from '../CrashMainUI';
import { CrashGameState } from '../../../Enum/CrashGameState';
import { PhoenixGameNetManager } from '../../../Net/PhoenixGameNetManager';
import { AudioMgr } from '../../../../Base/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('PhoenixBetSelectMainSubUI')
export class PhoenixBetSelectMainSubUI extends Component {
    
    curBetMoney: number=1000;
    mainUI: CrashMainUI;
    setMainUI(mainUI: CrashMainUI) {
        this.mainUI = mainUI;
           
        this.mainUI.view.btnSub.node.on(Node.EventType.TOUCH_START, (button) => {
            if(this.mainUI.curState != CrashGameState.StartBet)return
            
            AudioMgr.Instance(AudioMgr).playOneShot("aud_btn_bet_count");
            this.addBetMoney(false);
        })

        this.mainUI.view.btnAdd.node.on(Node.EventType.TOUCH_START, (button) => {
            if(this.mainUI.curState != CrashGameState.StartBet)return
            AudioMgr.Instance(AudioMgr).playOneShot("aud_btn_bet_count");
            this.addBetMoney(true);
        })

    }
    
   addBetMoney(isAdd: boolean) {
    this.curBetMoney = isAdd? this.curBetMoney + 1000 : this.curBetMoney - 1000;
 
    let curTableInfo =PhoenixGameNetManager.Instance(PhoenixGameNetManager).curTableInfo;
    this.curBetMoney = Math.max(curTableInfo.MinBet, this.curBetMoney);
    this.curBetMoney = Math.min(this.curBetMoney, curTableInfo.MaxBet);

    this.mainUI.view.txtBetMoney.text = this.curBetMoney.toLocaleString();
 }

}
