import { _decorator, Component, instantiate, Node } from 'cc';
import { CrashMainUI } from '../CrashMainUI';
import { CrashMHistoryBetTimesItem } from '../../Component/CrashMHistoryBetTimesItem';
import MsgDispatcher from '../../../../Base/MsgDispatcher';
import { PhoenixDataEvent } from '../../../Event/PhoenixEvent';
const { ccclass, property } = _decorator;

@ccclass('PhoenixStaticsMainSubUI')
export class PhoenixStaticsMainSubUI extends Component {
    mainUI: CrashMainUI;
    setMainUI(mainUI: CrashMainUI) {
        this.mainUI = mainUI;
    }
    
    start() {
        MsgDispatcher.Register(PhoenixDataEvent.RSP_GET_ROUND_INFO_HISTORY_BACK_EVENT.toString(),  this.onRSPGetRoundInfoHistoryBackEvnt.bind(this));
      
    }

    onRSPGetRoundInfoHistoryBackEvnt(data)
    {
       this.updateHistoryRecordView(data);
    }

    updateHistoryRecordView(data)
    {
       let last10 = data.List.slice(-10);
       for(let i=0;i<last10.length;i++)
       {
          let itemData = last10[i];
          this.addHistoryRecord(itemData.Multiplier);
       }
    }
 
    addHistoryRecord(endBetTimes: any) {
       let historyRecord = instantiate(this.mainUI.view.historyBetTimesItem)
       historyRecord.parent = this.mainUI.view.historyBetTimesItem.parent;
       historyRecord.getComponent(CrashMHistoryBetTimesItem).setTimes(endBetTimes);
       historyRecord.active = true;
       historyRecord.setSiblingIndex(0);
    }
 
}
