import { _decorator, Component, Node } from 'cc';
import { CrashMainUI } from '../CrashMainUI';
import MsgDispatcher from '../../../../Base/MsgDispatcher';
import { PhoenixDataEvent, PhoenixGameEvent } from '../../../Event/PhoenixEvent';
import { PhoenixGameNetManager } from '../../../Net/PhoenixGameNetManager';
const { ccclass, property } = _decorator;

@ccclass('PhoenixHistoryLogMainSubUI')
export class PhoenixHistoryLogMainSubUI extends Component {
    mainUI: CrashMainUI;
    setMainUI(mainUI: CrashMainUI) {
        this.mainUI = mainUI; 
    }

    start()
    {
        MsgDispatcher.Register(PhoenixDataEvent.RSP_GET_ONLINE_PLAYER_COUNT_BACK_EVENT.toString(),  this.onRSPGetPlayerCountBackEvnt.bind(this));
      
        MsgDispatcher.Register(PhoenixGameEvent.STATE_CHANGE_END_EVENT.toString(), this.onStateChangeEnd.bind(this));
    }

    onStateChangeEnd(endBetTimes) {
        let winCoins = PhoenixGameNetManager.Instance(PhoenixGameNetManager).getTotalWinMoney();
        let curTotalMoney = PhoenixGameNetManager.Instance(PhoenixGameNetManager).myPlayerInfo.GPoints;
        if(winCoins != 0)
        {
            this.mainUI.view.txtResultInfo2.string = this.mainUI.view.txtResultInfo1.string;
            this.updateRusultText(this.mainUI.view.txtResultInfo1,winCoins,curTotalMoney);
        }
    }
    
    updateRusultText(richText,winCoins: number,totalMoney: number) {
        let content = "";
        if(winCoins >= 0)
        {
            content = `<color=#ffffff>縂結算:</color><color=#00ff00> 贏 </color><color=#ffff64>${winCoins.toLocaleString()}</color> 銀幣，結餘 <color=#ffff64>${totalMoney.toLocaleString()}</color> 銀幣`;
        }
        else if(winCoins < 0)
        {
            content = `<color=#ffffff>縂結算:</color><color=#ff0000> 輸 </color><color=#ffff64>${Math.abs(winCoins).toLocaleString()}</color> 銀幣，結餘 <color=#ffff64>${totalMoney.toLocaleString()}</color> 銀幣`;   
        }
        richText.string = content;
    }

    
   onRSPGetPlayerCountBackEvnt(data)
   {
      this.updateOnlinePlayerCountView(data);
   }
  
   updateOnlinePlayerCountView(data)
   {
      this.mainUI.view.txtOnlinePlayerCount.string = "<color=#ffffff>在玩：</color><color=#ffff64>"+data+"</color>人";
   }

}
