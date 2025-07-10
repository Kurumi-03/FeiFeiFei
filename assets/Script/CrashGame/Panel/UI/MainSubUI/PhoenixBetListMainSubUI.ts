import { _decorator, Component, instantiate, Node } from 'cc';
import { PhoenixGameNetManager } from '../../../Net/PhoenixGameNetManager';
import { CrashBetItemComponent } from '../../Component/CrashBetItemComponent';
import { CrashMainUI } from '../CrashMainUI';
import MsgDispatcher from '../../../../Base/MsgDispatcher';
import { PhoenixDataEvent } from '../../../Event/PhoenixEvent';
const { ccclass, property } = _decorator;

@ccclass('PhoenixBetListMainSubUI')
export class PhoenixBetListMainSubUI extends Component {
    mainUI: CrashMainUI;
    curBetItems: CrashBetItemComponent[] = [];
    setMainUI(mainUI: CrashMainUI) {
        this.mainUI = mainUI;
    }
    
    start() {
        MsgDispatcher.Register(PhoenixDataEvent.RSP_BET_EVENT.toString(), this.onRSPBetEvent.bind(this));
        MsgDispatcher.Register(PhoenixDataEvent.RSP_GET_ALL_BACK_EVENT.toString(), this.onRSPGetAllBackEvent.bind(this));
        MsgDispatcher.Register(PhoenixDataEvent.RSP_GET_ITEM_BACK_EVENT.toString(), this.onRSPGetItemBackEvent.bind(this));
        
    }

    onRSPBetEvent(betData){
        this.updateBetItems(betData);
     }
     
     onRSPGetItemBackEvent(betResult)
     {
        this.updateCashOutItemView(betResult);
     }
  
     onRSPGetAllBackEvent(data){
        this.updateGetAllBackView(data);
     }

    updateBetItemsByReLogin()
    {
       let curBetDataList = PhoenixGameNetManager.Instance(PhoenixGameNetManager).curBetList;
       if(curBetDataList.length == this.curBetItems.length)return;
 
       this.curBetItems.forEach((item) => {
          item.node.destroy();
       });
       this.curBetItems = [];
 
       for(let i=0;i<curBetDataList.length;i++)
       {
          let betData = curBetDataList[i];
          this.addBetItem(betData);
       }
    }
 
    updateGetAllBackView(data)
    {
       this.curBetItems.forEach((item) => {
          item.setAlreadyGetBack(data);
       });
    }
 
    updateCashOutItemView(betResult)
    {
       this.curBetItems.forEach((item) => {
          let curBetID = item.getCurBetID();
          if(curBetID == betResult.BetId)
          {
             item.setAlreadyGetBack(betResult.Multiplier);
          }
       });
    }
 
    updateBetItems(betData)
    {
       this.addBetItem(betData);
    }
 
    addBetItem(betData) {
       let objBetItem = instantiate(this.mainUI.view.objBetItem)
       objBetItem.parent = this.mainUI.view.objBetItem.parent;
       objBetItem.active = true;
       objBetItem.setSiblingIndex(2);
 
       let betItemCom = objBetItem.getComponent(CrashBetItemComponent);
       this.curBetItems.push(betItemCom);
       betItemCom.setBetInfo(betData,this.curBetItems.length);
    }
 
    updateBetItemsByState() {
       this.curBetItems.forEach((item) => {
          item.setViewByState(this.mainUI.curState);
       });
    }
 
    cleanItems() {
       this.curBetItems.forEach((item) => {
          item.node.destroy();
       });
       this.curBetItems = [];
    }
 
}
