import {
   _decorator,
   Color,
   Component,
   instantiate,
   Node
} from 'cc';
import {
   CrashMainView
} from '../View/CrashMainView';
import MsgDispatcher from '../../../Base/MsgDispatcher';
import {
   PhoenixDataEvent,
   PhoenixGameEvent,
   PhoenixUIEvent
} from '../../Event/PhoenixEvent';
import {
   CrashUIType
} from '../../Enum/CrashUIType';
import { CrashMHistoryBetTimesItem } from '../Component/CrashMHistoryBetTimesItem';
import { CrashGameState } from '../../Enum/CrashGameState';
import { CrashBetItemComponent } from '../Component/CrashBetItemComponent';
import { PhoenixGameNetManager } from '../../Net/PhoenixGameNetManager';
import { SystemController } from '../../../Base/SystemController';
import { CrashRankBetItemComponent } from '../Component/CrashRankBetItemComponent';
import { PhoenixPlayerInfoMainSubUI } from './MainSubUI/PhoenixPlayerInfoMainSubUI';
import { PhoenixBetSelectMainSubUI } from './MainSubUI/PhoenixBetSelectMainSubUI';
import { PhoenixHistoryLogMainSubUI } from './MainSubUI/PhoenixHistoryLogMainSubUI';
import { PhoenixBetRankListMainSubUI } from './MainSubUI/PhoenixBetRankListMainSubUI';
import { PhoenixBetListMainSubUI } from './MainSubUI/PhoenixBetListMainSubUI';
import { PhoenixAutoCashOutMainSubUI } from './MainSubUI/PhoenixAutoCashOutMainSubUI';
import { PhoenixStaticsMainSubUI } from './MainSubUI/PhoenixStaticsMainSubUI';
import { PhoenixTimeStateMainSubUI } from './MainSubUI/PhoenixTimeStateMainSubUI';
import { AudioMgr } from '../../../Base/AudioMgr';
const {
   ccclass,
   property
} = _decorator;

@ccclass('CrashMainUI')
export class CrashMainUI extends Component {
   @property(CrashMainView)
   view: CrashMainView | null = null;

   curState:CrashGameState = CrashGameState.StartBet;
   curRoundIndex = 0;

   playerInfoSubUI: PhoenixPlayerInfoMainSubUI;
   betSelectSubUI: PhoenixBetSelectMainSubUI;
   historyLogSubUI: PhoenixHistoryLogMainSubUI;
   rankListSubUI: PhoenixBetRankListMainSubUI;
   betListSubUI: PhoenixBetListMainSubUI;
   autoCashOutSubUI: PhoenixAutoCashOutMainSubUI;
   staticsListSubUI: PhoenixStaticsMainSubUI;
   timeStateSubUI: any;

   start() {
      this.initView();
      this.initSubUI();
      this.initUIEvent();
      this.initGameEvent();
   }

   initView(){  
      this.view.objBetGroup.node.active = false;
      this.view.objBetButtonGroup.node.active = false;
      this.view.txtEndBetTimes.node.active = false;
   }

   initSubUI() {
      this.playerInfoSubUI = this.node.addComponent(PhoenixPlayerInfoMainSubUI);
      this.playerInfoSubUI.setMainUI(this);
      this.betSelectSubUI = this.node.addComponent(PhoenixBetSelectMainSubUI);
      this.betSelectSubUI.setMainUI(this);
      this.historyLogSubUI = this.node.addComponent(PhoenixHistoryLogMainSubUI);
      this.historyLogSubUI.setMainUI(this);
      this.rankListSubUI = this.node.addComponent(PhoenixBetRankListMainSubUI);
      this.rankListSubUI.setMainUI(this);
      this.betListSubUI = this.node.addComponent(PhoenixBetListMainSubUI);
      this.betListSubUI.setMainUI(this);
      this.autoCashOutSubUI = this.node.addComponent(PhoenixAutoCashOutMainSubUI);
      this.autoCashOutSubUI.setMainUI(this);
      this.staticsListSubUI = this.node.addComponent(PhoenixStaticsMainSubUI);
      this.staticsListSubUI.setMainUI(this);
      this.timeStateSubUI = this.node.addComponent(PhoenixTimeStateMainSubUI);
      this.timeStateSubUI.setMainUI(this);
   }

   initUIEvent() {
      this.view.btnMenu.node.on(Node.EventType.TOUCH_START, (button) => {
        AudioMgr.Instance(AudioMgr).playOneShot("aud_systembtn");
         MsgDispatcher.Send(PhoenixUIEvent.SHOW_UI.toString(), CrashUIType.MenuUI);
      })

      this.view.btnRank.node.on(Node.EventType.TOUCH_START, (button) => {
         AudioMgr.Instance(AudioMgr).playOneShot("aud_systembtn");
         MsgDispatcher.Send(PhoenixUIEvent.SHOW_UI.toString(), CrashUIType.RankUI);
      })

      this.view.btnStatics.node.on(Node.EventType.TOUCH_START, (button) => {
         AudioMgr.Instance(AudioMgr).playOneShot("aud_systembtn");
         MsgDispatcher.Send(PhoenixUIEvent.SHOW_UI.toString(), CrashUIType.StaticsHistoryUI);
      })

      this.view.btnBet.node.on(Node.EventType.TOUCH_START, (button) => {
         MsgDispatcher.Send(PhoenixDataEvent.REQ_BET_EVENT.toString(), this.betSelectSubUI.curBetMoney,this.autoCashOutSubUI.curChooseBetTimes);
      })

      this.view.btnGetBackMoney.node.on(Node.EventType.TOUCH_START, (button) => {
         MsgDispatcher.Send(PhoenixDataEvent.REQ_GET_ALL_BACK_EVENT.toString());
      })
   }
   
   initGameEvent() {
       //游戏状态变化事件处理
      MsgDispatcher.Register(PhoenixGameEvent.STATE_CHANGE_PREPARE_EVENT.toString(), this.onStateChangePrepare.bind(this));
      MsgDispatcher.Register(PhoenixGameEvent.STATE_CHANGE_START_EVENT.toString(), this.onStateChangeStart.bind(this));
      MsgDispatcher.Register(PhoenixGameEvent.STATE_CHANGE_PROGRESS_EVENT.toString(), this.onStateChangeProgress.bind(this));
      MsgDispatcher.Register(PhoenixGameEvent.STATE_CHANGE_END_EVENT.toString(), this.onStateChangeEnd.bind(this));
   }

//#region 游戏状态事件处理
   onStateChangePrepare() {
      this.curState = CrashGameState.StartBet;

      this.view.prepareNode.active = true;
      this.view.progressNode.active = false;
      this.view.endNode.active = false;

      this.view.txtPrepareTime.node.active = true;
      this.view.txtProgressTime.node.active = false;
      this.view.txtEndTime.node.active = false;
      this.view.txtEndBetTimes.node.active = false;

      this.view.btnBet.node.active = true;
      this.view.btnBet.interactable = true;
      this.view.btnAdd.interactable = true;
      this.view.btnSub.interactable = true;
      this.view.btnBetSetting.interactable = true;
      this.view.togAutoCashOut.interactable = true;

      this.view.togAutoCashOut.interactable = true;
      this.view.objBetGroup.node.active = true;
      this.view.objBetButtonGroup.node.active = true;
      
      this.view.objBetGroup.setColor(new Color(255, 255,255,255));
      this.view.objBetButtonGroup.setColor(new Color(255, 255,255,255));
      
      this.view.btnGetBackMoney.node.active = false;
      this.view.txtGetBackMoney.node.active = false;
      
      this.view.objBetResultNode.active = false;

      this.betListSubUI.cleanItems();
      this.rankListSubUI.cleanItems();
      this.betListSubUI.updateBetItemsByReLogin();
      this.playerInfoSubUI.updatePlayerInfo();
      this.autoCashOutSubUI.updateAutoCashView();
   }
 
   onStateChangeStart() {
      this.curState = CrashGameState.START;
      
      this.view.prepareNode.active = false;
      this.view.progressNode.active = false;
      this.view.endNode.active = false;
      
      this.view.txtPrepareTime.node.active = false;
      this.view.txtProgressTime.node.active = false;
      this.view.txtEndTime.node.active = false;
      this.view.txtEndBetTimes.node.active = false;

      this.view.btnBet.node.active = true;
      this.view.btnAdd.interactable = false;
      this.view.btnSub.interactable = false;
      this.view.togAutoCashOut.interactable = false;
      
      
      this.view.btnGetBackMoney.node.active = false;
      this.view.txtGetBackMoney.node.active = false;

      this.view.objBetResultNode.active = false;

      this.betListSubUI.updateBetItemsByReLogin();
      this.playerInfoSubUI.updatePlayerInfo();
      this.autoCashOutSubUI.updateAutoCashView();
   
      this.view.objBetGroup.setColor(new Color(255, 255,255,128));
      this.view.objBetButtonGroup.setColor(new Color(255, 255,255,this.betListSubUI.curBetItems.length>0?255:128));

      MsgDispatcher.Send(PhoenixUIEvent.CLOSE_UI.toString(), CrashUIType.BetSetingUI);
   }

   onStateChangeProgress() {
      this.curState = CrashGameState.StartShowdown;
      
      this.view.prepareNode.active = false;
      this.view.progressNode.active = true;
      this.view.endNode.active = false;
      
      this.view.txtPrepareTime.node.active = false;
      this.view.txtProgressTime.node.active = true;
      this.view.txtEndTime.node.active = false;
      this.view.txtEndBetTimes.node.active = false;
      
      this.view.btnBet.node.active = false;
      this.view.btnGetBackMoney.node.active = true;
      this.view.txtGetBackMoney.node.active = true;
      
      this.view.btnAdd.interactable = false;
      this.view.btnSub.interactable = false;
      this.view.btnBetSetting.interactable = false;
      this.view.togAutoCashOut.interactable = false;

      this.view.objBetResultNode.active = false;

      this.betListSubUI.updateBetItemsByReLogin();
      this.betListSubUI.updateBetItemsByState();
      
      this.playerInfoSubUI.updatePlayerInfo();
      this.autoCashOutSubUI.updateAutoCashView();

      this.view.objBetGroup.setColor(new Color(255, 255,255,128));
      this.view.objBetButtonGroup.setColor(new Color(255, 255,255,this.betListSubUI.curBetItems.length>0?255:128));

      this.view.objBetGroup.node.active = this.betListSubUI.curBetItems.length>0;
      this.view.objBetButtonGroup.node.active = this.betListSubUI.curBetItems.length>0;
   }

   onStateChangeEnd(endBetTimes) {
      this.curState = CrashGameState.END;
      
      this.view.prepareNode.active = false;
      this.view.progressNode.active = false;
      this.view.endNode.active = true;
      
      this.view.txtPrepareTime.node.active = false;
      this.view.txtProgressTime.node.active = false;
      this.view.txtEndTime.node.active = true;
      this.view.txtEndBetTimes.node.active = true;

      let finalRate = PhoenixGameNetManager.Instance(PhoenixGameNetManager).getCurRoundRate();
      this.view.txtEndBetTimes.node.active= finalRate>0;
      this.view.txtEndBetTimes.text = finalRate.toFixed(2)+"x"

      this.view.btnAdd.interactable = false;
      this.view.btnSub.interactable = false;
      this.view.btnBetSetting.interactable = false;
      this.view.togAutoCashOut.interactable = false;
      this.view.btnGetBackMoney.interactable = false;

      this.view.objBetGroup.setColor(new Color(255, 255,255,128));
      this.view.objBetButtonGroup.setColor(new Color(255, 255,255,128));
      
      this.betListSubUI.updateBetItemsByReLogin();

      this.view.objBetGroup.node.active = this.betListSubUI.curBetItems.length>0;
      this.view.objBetButtonGroup.node.active = this.betListSubUI.curBetItems.length>0;

      this.view.objBetResultNode.active = this.betListSubUI.curBetItems.length>0;
      this.view.objBetResultNode.setSiblingIndex(100);

      let winCoins = PhoenixGameNetManager.Instance(PhoenixGameNetManager).getTotalWinMoney();
      if(winCoins >= 0)this.view.txtBetResultMoney.text = "+"+winCoins;
      else this.view.txtBetResultMoney.text = "-"+Math.abs(winCoins);
     
      if(finalRate>0)this.staticsListSubUI.addHistoryRecord(finalRate);
      this.playerInfoSubUI.updatePlayerInfo();
      this.autoCashOutSubUI.updateAutoCashView();
   }

   updateCaskOutAllMoney()
   {
      if(this.curState == CrashGameState.StartShowdown)
      {
         let allBetMoney = PhoenixGameNetManager.Instance(PhoenixGameNetManager).getCurRoundAllBetMoney();
         this.view.txtGetBackMoney.text = Math.floor(allBetMoney).toString();

         let isAllCashOut = PhoenixGameNetManager.Instance(PhoenixGameNetManager).isAllCashOut();
         this.view.objBetButtonGroup.setColor(new Color(255, 255,255,isAllCashOut?128:255));
         
         this.view.btnGetBackMoney.interactable = !isAllCashOut;
      }
   }

   update(deltaTime: number) {
      this.updateCaskOutAllMoney();
   }
}