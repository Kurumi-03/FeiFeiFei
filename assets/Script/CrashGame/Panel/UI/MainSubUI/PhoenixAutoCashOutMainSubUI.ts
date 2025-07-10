import { _decorator, Component, Node } from 'cc';
import { PhoenixGameNetManager } from '../../../Net/PhoenixGameNetManager';
import { CrashMainUI } from '../CrashMainUI';
import MsgDispatcher from '../../../../Base/MsgDispatcher';
import { CrashGameState } from '../../../Enum/CrashGameState';
import { CrashUIType } from '../../../Enum/CrashUIType';
import { PhoenixDataEvent, PhoenixGameEvent, PhoenixUIEvent } from '../../../Event/PhoenixEvent';
import { AudioMgr } from '../../../../Base/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('PhoenixAutoCashOutMainSubUI')
export class PhoenixAutoCashOutMainSubUI extends Component {
    mainUI: CrashMainUI;
    
   curChooseBetTimes: number=5.50;
    setMainUI(mainUI: CrashMainUI) {
        this.mainUI = mainUI;
    }

    start() {
        MsgDispatcher.Register(PhoenixDataEvent.RSP_SET_AUTO_CASH_OUT_BACK_EVENT.toString(),  this.onRSPSetAutoCashOutBackEvnt.bind(this));
   
        MsgDispatcher.Register(PhoenixGameEvent.CHOOSE_BET_TIMES_EVENT.toString(),this.onChooseBetTimesEvnt.bind(this));

        this.mainUI.view.btnBetSetting.node.on(Node.EventType.TOUCH_START, (button) => {
            
            if(this.mainUI.curState == CrashGameState.StartShowdown)return
            if(this.mainUI.curState == CrashGameState.StartBet)
            {
               AudioMgr.Instance(AudioMgr).playOneShot("aud_systembtn");
                MsgDispatcher.Send(PhoenixUIEvent.SHOW_UI.toString(), CrashUIType.BetSetingUI);
            }
        })

        this.mainUI.view.togAutoCashOut.node.on(Node.EventType.TOUCH_END, (button) => {
         
            if(this.mainUI.curState != CrashGameState.StartBet)return
            AudioMgr.Instance(AudioMgr).playOneShot("aud_systembtn");
            if(!this.mainUI.view.togAutoCashOut.isChecked)
            {
               PhoenixGameNetManager.Instance(PhoenixGameNetManager).ReqSetAutoCashOut(Number(this.mainUI.view.txtChooseCurrentBetTimes.string.replace("x","")));
            }
            else
            {
               PhoenixGameNetManager.Instance(PhoenixGameNetManager).ReqSetAutoCashOut(0);
            }
         })
    }
    onRSPSetAutoCashOutBackEvnt(data)
    {
       this.updateAutoCashView();
    }
 
   onChooseBetTimesEvnt(data)
   {
      if(Number(data)<=0)return;

      this.curChooseBetTimes = Number(data);
      this.mainUI.view.txtChooseCurrentBetTimes.string = data+"x";
      if(this.mainUI.view.togAutoCashOut.isChecked)
      {
         PhoenixGameNetManager.Instance(PhoenixGameNetManager).ReqSetAutoCashOut(Number(data));
      }
   }

   updateAutoCashView()
   {
      let autoCashOutMultiplier = PhoenixGameNetManager.Instance(PhoenixGameNetManager).autoCashOutMultiplier;
      this.mainUI.view.togAutoCashOut.isChecked = autoCashOutMultiplier > 0;
      
      if(autoCashOutMultiplier>0)
      {
         this.mainUI.view.txtChooseCurrentBetTimes.string = autoCashOutMultiplier+"x";
      }
   }
}
