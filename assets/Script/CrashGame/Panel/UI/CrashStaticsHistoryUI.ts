import { _decorator, Component, instantiate, Node } from 'cc';
import { CrashStaticsHistoryView } from '../View/CrashStaticsHistoryView';
import { CrashHistoryRateItem } from '../Component/CrashHistoryRateItem';
import MsgDispatcher from '../../../Base/MsgDispatcher';
import { PhoenixDataEvent } from '../../Event/PhoenixEvent';
import { PhoenixGameNetManager } from '../../Net/PhoenixGameNetManager';
const { ccclass, property } = _decorator;

@ccclass('CrashStaticsHistoryUI')
export class CrashStaticsHistoryUI extends Component {
    @property(CrashStaticsHistoryView)
    view:CrashStaticsHistoryView | null = null;
    historyRecordList: any=[];
    staticsRateList: any = [0,1,2,5,20,100000];
    staticsCountList: any = [0,0,0,0,0];
    start() {
        MsgDispatcher.Register(PhoenixDataEvent.RSP_GET_ROUND_INFO_HISTORY_BACK_EVENT.toString(),  this.onRSPGetRoundInfoHistoryBackEvnt.bind(this));
        
        let data = PhoenixGameNetManager.Instance(PhoenixGameNetManager).getHistoryRateRecords();
        this.updateView(data);
    }

    protected onEnable(): void {
        PhoenixGameNetManager.Instance(PhoenixGameNetManager).ReqGetRoundInfoHistory();
    }

    onRSPGetRoundInfoHistoryBackEvnt(data)
    {
       this.updateView(data);
    }

    updateView(data) {
       this.updateStatics(data);
       this.historyRecordList.forEach((item) => {
           item.active = false;
       });

       for(let i=0;i<data.List.length;i++)
       {
          let itemData = data.List[i];
          if( this.historyRecordList.length > i)
          {
            let historyRecord = this.historyRecordList[i];
            historyRecord.getComponent(CrashHistoryRateItem).setData(itemData.RoundId,itemData.Multiplier);
            historyRecord.active = true;
            historyRecord.setSiblingIndex(0);
          }
          else
          {

            this.addHistoryRecord(itemData);
          }
       }

       this.view.txtRateDayHigh.string = data.TodaysMultiplier+"x";
       this.view.txtRateGameHigh.string = data.HistoricalMultiplier+"x";
    }

    addHistoryRecord(itemData) {
        let historyRecord = instantiate(this.view.objRateItem)
        historyRecord.parent = this.view.objRateItem.parent;
        historyRecord.getComponent(CrashHistoryRateItem).setData(itemData.RoundId,itemData.Multiplier);
        historyRecord.active = true;
        historyRecord.setSiblingIndex(0);

        this.historyRecordList.push(historyRecord);
     }

     updateStatics(data)
     {
        this.staticsCountList = [0,0,0,0,0];
        for(let i=0;i<this.staticsRateList.length-1;i++)
        {
            let rateStart = this.staticsRateList[i];
            let rateEnd = this.staticsRateList[i+1];
            for(let j=0;j<data.length;j++)
            {
                let itemData = data[j];
                if(itemData.Multiplier>rateStart && itemData.Multiplier <= rateEnd)
                {
                    this.staticsCountList[i]++;
                }
            }
        }

        this.view.txtRate0.string = this.staticsCountList[0].toString()+"次";
        this.view.txtRate1.string = this.staticsCountList[1].toString()+"次";
        this.view.txtRate2.string = this.staticsCountList[2].toString()+"次";
        this.view.txtRate3.string = this.staticsCountList[3].toString()+"次";
        this.view.txtRate4.string = this.staticsCountList[4].toString()+"次";
     }
}


