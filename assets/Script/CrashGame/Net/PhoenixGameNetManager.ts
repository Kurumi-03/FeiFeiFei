import {
  _decorator,
  sys
} from "cc";
import Game_WebSocketController from "../../Base/Game_WebSocketController";
import MsgDispatcher from "../../Base/MsgDispatcher";
import { Progarm } from "../../Base/Progarm";
import Singleton from "../../Base/Singleton";
import { SystemController } from "../../Base/SystemController";
import { SystemMsg } from "../../Base/SystemMsg";
import { tokon } from "../../Global/tokon";
import { CrashGameApp } from "../CrashGameApp";
import { CrashGameState } from "../Enum/CrashGameState";
import { PhoenixDataEvent, PhoenixGameEvent } from "../Event/PhoenixEvent";
import  richcli  from "../../../proto/richsrv-cli.js";
import PhoenixGameConfig from "../Config/PhoenixGameConfig";
import { AudioMgr } from "../../Base/AudioMgr";
const {
  ccclass
} = _decorator;

@ccclass("PhoenixGameNetManager")
export class PhoenixGameNetManager extends Singleton < PhoenixGameNetManager > {
  private curSyncId = 0; //同步ID
  curBetTimes: number;
  myPlayerInfo: richcli.PhoenixProtocol.PlayerInfo;
  curTableInfo: richcli.PhoenixProtocol.TableInfo;
  curBetList = [];
  curBetCashOutList = [];
  curBetResultMoney: number = 0;
  autoCashOutMultiplier: number = 0;

  curRoundMultiplier: number = 0;
  curNotifyGameState: richcli.PhoenixProtocol.NotifyGameState;
  curShowDownStateData: richcli.PhoenixProtocol.ShowdownState;
  lastHistoryRoundInfo: any;
  curRoundInfo: richcli.PhoenixProtocol.RoundStartState;

  init() {
    // this.InitMyPlayerInfo();

    MsgDispatcher.Register(PhoenixDataEvent.REQ_GET_BACK_EVENT.toString(), this.OnEventReqGetBetBack.bind(this));
    MsgDispatcher.Register(PhoenixDataEvent.REQ_BET_EVENT.toString(), this.OnEventReqBet.bind(this));
    MsgDispatcher.Register(PhoenixDataEvent.REQ_GET_ALL_BACK_EVENT.toString(), this.OnEventReqGetAllBetBack.bind(this));
    // 监听服务器消息
    Game_WebSocketController.Instance(
      Game_WebSocketController,
    ).Register_SendReceiptMessage(this.onGameReceiptMessage.bind(this));
    Game_WebSocketController.Instance(
      Game_WebSocketController,
    ).Register_SendStateMessage(this.onGameStateMessage.bind(this));
    MsgDispatcher.Register("ReEnterGame", this.reqEnterPhoenixGame.bind(this));

    this.OnReqEnterGame();
  }

//#region 處理事件
  OnEventReqGetBetBack(data)
  {
    this.OnReqGetBetBack(data);
    
    AudioMgr.Instance(AudioMgr).playOneShot("aud_btn_get");
  }

  OnEventReqGetAllBetBack()
  {
    if(this.curBetList.length == 0) return;

    let isAllCashOut = PhoenixGameNetManager.Instance(PhoenixGameNetManager).isAllCashOut();
    if(isAllCashOut)return;
    AudioMgr.Instance(AudioMgr).playOneShot("aud_btn_get");
    this.ReqCashOutAll();
  }

  OnEventReqBet(amount, betTimes) {
    if(this.curBetList.length >= 5) return;
    
    AudioMgr.Instance(AudioMgr).playOneShot("aud_btn_bet");
    this.placeBetRequest(amount);
  }
//#endregion

//#region 请求接口
  //第一次進來要呼叫
  async OnReqEnterGame() {
    let EnterGameRequest_ = new richcli.PhoenixProtocol.EnterGameRequest();
    Progarm.log("globalThis.RoomTokon", globalThis.RoomTokon);
    EnterGameRequest_.TableToken = tokon.getInstance().roomTokon;
    Progarm.log(
      "send EnterGameRequest_",
      EnterGameRequest_,
      new Date().toLocaleString(),
    );
    Progarm.log("globalThis.gameSrvName", globalThis.gameSrvName);
    let res = await Game_WebSocketController.Instance(Game_WebSocketController)
      .channel()
      .sendRequest(`${globalThis.gameSrvName}.EnterGame`, EnterGameRequest_);
    Progarm.log("res", res);

    let EnterGameResponse = new richcli.PhoenixProtocol.EnterGameResponse(res);
    Progarm.log("EnterGameResponse: ", EnterGameResponse);

  }

  async OnReqGetBetBack(data) {
    try {
      let CashOutRequest = new richcli.PhoenixProtocol.CashOutRequest();
      Progarm.log("globalThis.RoomTokon", globalThis.RoomTokon);
      CashOutRequest.TableToken = tokon.getInstance().roomTokon;
      CashOutRequest.BetId = data.BetId;
      Progarm.log("globalThis.gameSrvName", globalThis.gameSrvName);
      let res = await Game_WebSocketController.Instance(Game_WebSocketController)
        .channel()
        .sendRequest(`${globalThis.gameSrvName}.CashOut`, CashOutRequest);
      Progarm.log("res:", res);

      const CashOutResponse = new richcli.PhoenixProtocol.CashOutResponse(res);
      Progarm.log("CashOutResponse: ", CashOutResponse);

      this.myPlayerInfo.GPoints = CashOutResponse.BetResult.GPoints;
      MsgDispatcher.Send(PhoenixGameEvent.UPDATE_PLAYER_INFO_EVENT.toString());
      this.curBetCashOutList.push(CashOutResponse.BetResult);
      MsgDispatcher.Send(PhoenixDataEvent.RSP_GET_ITEM_BACK_EVENT.toString(), CashOutResponse.BetResult);
    } catch (e) {
      if (e instanceof Error) {
        Progarm.error(e.name, e.message, e.stack);
      } else {
        Progarm.error(e.message);
      }
    }
  }

  async ReqGetRoundInfoHistory() {
    try {
      let request = new richcli.PhoenixProtocol.GetRoundInfoHistoryRequest();
      request.TableToken = tokon.getInstance().roomTokon;
      let res = await Game_WebSocketController.Instance(Game_WebSocketController)
        .channel()
        .sendRequest(`${globalThis.gameSrvName}.GetRoundInfoHistory`, request);
      Progarm.log("res:", res);

      const response = new richcli.PhoenixProtocol.GetRoundInfoHistoryResponse(res);
      Progarm.log("GetRoundInfoHistoryResponse: ", response);
      this.lastHistoryRoundInfo = response;
      MsgDispatcher.Send(PhoenixDataEvent.RSP_GET_ROUND_INFO_HISTORY_BACK_EVENT.toString(), response);
    } catch (e) {
      if (e instanceof Error) {
        Progarm.error(e.name, e.message, e.stack);
      } else {
        Progarm.error(e.message);
      }
    }
  }

  async ReqGetBetRankingList() {
    try {
      let request = new richcli.PhoenixProtocol.GetBetRankingListRequest();
      request.TableToken = tokon.getInstance().roomTokon;
      let res = await Game_WebSocketController.Instance(Game_WebSocketController)
        .channel()
        .sendRequest(`${globalThis.gameSrvName}.GetBetRankingList`, request);
      Progarm.log("res:", res);

      const response = new richcli.PhoenixProtocol.GetBetRankingListResponse(res);
      Progarm.log("GetBetRankingListResponse: ", response);
      MsgDispatcher.Send(PhoenixDataEvent.RSP_GET_BET_RANKING_LIST_BACK_EVENT.toString(), response);
    } catch (e) {
      if (e instanceof Error) {
        Progarm.error(e.name, e.message, e.stack);
      } else {
        Progarm.error(e.message);
      }
    }
  }

  async ReqSetAutoCashOut(betTimes) {
    try {
      let request = new richcli.PhoenixProtocol.SetAutoCashOutRequest();
      request.TableToken = tokon.getInstance().roomTokon;
      request.Multiplier = betTimes;
      let res = await Game_WebSocketController.Instance(Game_WebSocketController)
        .channel()
        .sendRequest(`${globalThis.gameSrvName}.SetAutoCashOut`, request);
      Progarm.log("res:", res);

      const response = new richcli.PhoenixProtocol.SetAutoCashOutResponse(res);
      Progarm.log("SetAutoCashOutResponse: ", response);
      this.autoCashOutMultiplier = response.Multiplier;
      MsgDispatcher.Send(PhoenixDataEvent.RSP_SET_AUTO_CASH_OUT_BACK_EVENT.toString(),response);
    } catch (e) {
      if (e instanceof Error) {
        Progarm.error(e.name, e.message, e.stack);
      } else {
        Progarm.error(e.message);
      }
    }
  }

  async ReqCashOutAll() {
    try {
      let request = new richcli.PhoenixProtocol.CashOutAllRequest();
      request.TableToken = tokon.getInstance().roomTokon;
      let res = await Game_WebSocketController.Instance(Game_WebSocketController)
        .channel()
        .sendRequest(`${globalThis.gameSrvName}.CashOutAll`, request);
      Progarm.log("res:", res);
      // Progarm.log("ReqCashOutAll  RoundId :"+this.curRoundInfo.RoundId, " Sno:",this.curRoundInfo.Sno)
      const response = new richcli.PhoenixProtocol.CashOutAllResponse(res);
      Progarm.log("CashOutAllResponse: ", response);
      for (let i = 0; i < response.List.length; i++) {
        this.myPlayerInfo.GPoints = response.List[i].GPoints;
        MsgDispatcher.Send(PhoenixGameEvent.UPDATE_PLAYER_INFO_EVENT.toString());
        this.curBetCashOutList.push(response.List[i]);
        MsgDispatcher.Send(PhoenixDataEvent.RSP_GET_ITEM_BACK_EVENT.toString(), response.List[i]);
      }
    } catch (e) {
      if (e instanceof Error) {
        Progarm.error(e.name, e.message, e.stack);
      } else {
        Progarm.error(e.message);
      }
    }
  }

  async ReqOnlinePlayerCount() {
    try {
      let request = new richcli.PhoenixProtocol.GetOnlinePlayerCountRequest();
      request.TableToken = tokon.getInstance().roomTokon;
      Progarm.log("globalThis.RoomTokon", globalThis.RoomTokon);
      Progarm.log("globalThis.gameSrvName", globalThis.gameSrvName);
      let res = await Game_WebSocketController.Instance(Game_WebSocketController)
        .channel()
        .sendRequest(`${globalThis.gameSrvName}.GetOnlinePlayerCount`, request);
      Progarm.log("res:", res);

      const response = new richcli.PhoenixProtocol.GetOnlinePlayerCountResponse(res);
      Progarm.log("GetOnlinePlayerCountResponse: ", response);
      MsgDispatcher.Send(PhoenixDataEvent.RSP_GET_ONLINE_PLAYER_COUNT_BACK_EVENT.toString(), response.PlayerCount);
    } catch (e) {
      if (e instanceof Error) {
        Progarm.error(e.name, e.message, e.stack);
      } else {
        Progarm.error(e.message);
      }
    }
  }

  async placeBetRequest(amount) {
    try {
      let PlaceBetRequest = new richcli.PhoenixProtocol.PlaceBetRequest();
      Progarm.log("globalThis.RoomTokon", globalThis.RoomTokon);
      PlaceBetRequest.TableToken = tokon.getInstance().roomTokon;
      PlaceBetRequest.Amount = amount;
      Progarm.log("globalThis.gameSrvName", globalThis.gameSrvName);
      let res = await Game_WebSocketController.Instance(Game_WebSocketController)
        .channel()
        .sendRequest(`${globalThis.gameSrvName}.PlaceBet`, PlaceBetRequest);
      Progarm.log("res", res);
      let PlaceBetResponse = new richcli.PhoenixProtocol.PlaceBetResponse(res);
      Progarm.log("PlaceBetResponse: ", PlaceBetResponse);
      this.myPlayerInfo.GPoints = PlaceBetResponse.GPoints;
      MsgDispatcher.Send(PhoenixGameEvent.UPDATE_PLAYER_INFO_EVENT.toString());
    } catch (e) {
      if (e instanceof Error) {
        Progarm.error(e.name, e.message, e.stack);
      } else {
        Progarm.error(e.message);
      }
    }
  }

  //重新進入遊戲(斷線用的)
  async reqEnterPhoenixGame() {
    try {
      if (!globalThis.isGameAccessDenied) {
        SystemMsg.Instance().Show("遊戲進行中、請稍後");
        return;
      }
      let enterGameReqData = new richcli.PhoenixProtocol.EnterGameRequest();
      enterGameReqData.TableToken = globalThis.Roomtoken;
      enterGameReqData.TableKey = globalThis.RoomKey;
      enterGameReqData.PlayerId = Number(globalThis.PlayerId);
      enterGameReqData.PlayerToken = globalThis.PlayerToken;
      enterGameReqData.Version = SystemController.Instance().VersionNumber;

      try {
        let response_ = await Game_WebSocketController.Instance(
            Game_WebSocketController,
          )
          .channel()
          .sendRequest(globalThis.gameSrvName + ".EnterGame", enterGameReqData);
        Progarm.error(response_);
      } catch (error) {
        Progarm.error(error);
      }
    } catch (e) {
      if (e instanceof Error) {
        Progarm.error(e.name, e.message, e.stack);
      } else {
        Progarm.error(e.message);
      }
    }
  }
  //回復同步訊號，跟server說我要進下個階段
  private ReplayCurrentSync() {
    try {
      if (this.curSyncId == 0) {
        return;
      }
      Progarm.log("ReplayCurrentSync...", new Date().toLocaleString());
      let ReplySyncRequest = new richcli.JuYouGamesProtocol.ReplySyncRequest();
      ReplySyncRequest.TableToken = globalThis.Roomtoken;
      ReplySyncRequest.SyncId = this.curSyncId;
      Progarm.log(
        "ReplySyncRequest:",
        ReplySyncRequest,
        new Date().toLocaleString(), );
      Game_WebSocketController.Instance(Game_WebSocketController)
        .channel()
        .sendRequest(`${globalThis.gameSrvName}.ReplySync`, ReplySyncRequest);

      this.curSyncId = 0;
    } catch (e) {
      if (e instanceof Error) {
        Progarm.error(e.name, e.message, e.stack);
      } else {
        Progarm.error(e.message);
      }
    }
  }
  //#endregion

//#region 服务器推送消息
  async onGameReceiptMessage(msgType: string, msgContent: any) {
     Progarm.error("====>onGameReceiptMessage: ", msgType);
    switch (msgType) {
      case "EnterGame": {
        const EnterGameReceipData =
          new richcli.PhoenixProtocol.EnterGameReceipt(msgContent);
        Progarm.log(
          `EnterGameReceipData: ${JSON.stringify(EnterGameReceipData)}`,
        );
        this.curSyncId = EnterGameReceipData.SyncPoint.SyncId;

        this.ProcessSyncPointData(EnterGameReceipData.SyncPoint);
        
        this.ReqGetRoundInfoHistory();
       
        this.schedule(() => {
          this.ReqOnlinePlayerCount();
        }, PhoenixGameConfig.OnlinePlayerCountUpdateInterval);
        break;
      }
      case "CashOut":
        let RoadInfoData: richcli.PhoenixProtocol.CashOutReceipt =
          new richcli.PhoenixProtocol.CashOutReceipt(msgContent);
        Progarm.log(RoadInfoData);
        MsgDispatcher.Send(PhoenixDataEvent.RSP_GET_ITEM_BACK_EVENT.toString(), RoadInfoData.BetResult);
        break;
      case "CashOutAll":
        AudioMgr.Instance(AudioMgr).playOneShot("aud_btn_get");
        let CashOutAllReceipt: richcli.PhoenixProtocol.CashOutAllReceipt =
          new richcli.PhoenixProtocol.CashOutAllReceipt(msgContent);
        Progarm.log(CashOutAllReceipt);
        if (CashOutAllReceipt.PlayerId == this.myPlayerInfo.Id) {
          if(CashOutAllReceipt.List.length>0)this.curBetCashOutList = [];
          for (let i = 0; i < CashOutAllReceipt.List.length; i++) { 
            this.curBetCashOutList.push(CashOutAllReceipt.List[i]);         
            MsgDispatcher.Send(PhoenixDataEvent.RSP_GET_ITEM_BACK_EVENT.toString(), CashOutAllReceipt.List[i]);
          }
        }
        break;
      case "PlaceBet":
        let PlaceBet: richcli.PhoenixProtocol.PlaceBetReceipt =
          new richcli.PhoenixProtocol.PlaceBetReceipt(msgContent);
        Progarm.log(PlaceBet);
        if (PlaceBet.PlayerId == this.myPlayerInfo.Id) {
          this.curBetList.push(PlaceBet.BetInfo);
          
          MsgDispatcher.Send(PhoenixDataEvent.RSP_BET_EVENT.toString(), PlaceBet.BetInfo);
        }
        break;
      case "NotifyGameState":
        let NotifyGameStateData: richcli.PhoenixProtocol.NotifyGameState =
          new richcli.PhoenixProtocol.NotifyGameState(msgContent);
        Progarm.log("NotifyGameState:",NotifyGameStateData);

        this.curNotifyGameState = NotifyGameStateData
        if(NotifyGameStateData.GameOver)
        {
          this.ReplayCurrentSync();
        }
        break;
    }
  }
  //断线重连逻辑处理
  ProcessSyncPointData(syncPoint: richcli.JuYouGamesProtocol.SyncPoint) {
      //server剩餘時間，豪秒改成秒
      let syncRemainingTime: number = Math.floor(
        syncPoint.SyncRemainingTime / 1000,
    );

    switch (syncPoint.Name) {
      case "RoundStartSyncPoint": {
        let RoundStartSyncPoint: richcli.PhoenixProtocol.RoundStartSyncPoint =
          new richcli.PhoenixProtocol.RoundStartSyncPoint(syncPoint.Data);
        Progarm.log(
          `RoundStartSyncPoint: ${JSON.stringify(RoundStartSyncPoint)}`,
        );
        this.curTableInfo = RoundStartSyncPoint.Table;
        this.autoCashOutMultiplier = RoundStartSyncPoint.AutoCashOut;
        for (let i = 0; i < RoundStartSyncPoint.Players.length; i++) {
          if (RoundStartSyncPoint.Players[i].Id.toString() == globalThis.PlayerId) {
            this.InitMyPlayerInfo(RoundStartSyncPoint.Players[i]);
            break;
          }
        }
       
        this.scheduleOnce(() => {
          this.ReplayCurrentSync();
        }, syncRemainingTime);

        CrashGameApp.Instance().chageState(CrashGameState.END, syncPoint.SyncRemainingTime / 1000);
        break;
      }
      case "BetTimeSyncPoint": {
        let BetTimeSyncPoint: richcli.PhoenixProtocol.BetTimeSyncPoint =
          new richcli.PhoenixProtocol.BetTimeSyncPoint(syncPoint.Data);
        Progarm.log(
          `BetTimeSyncPoint: ${JSON.stringify(BetTimeSyncPoint)}`,
        );
        let syncRemainingTime: number = Math.floor(
          syncPoint.SyncRemainingTime / 1000,
        );

        this.schedule(() => {
          this.ReqGetBetRankingList();
        }, PhoenixGameConfig.RankUpdateInterval,Math.ceil(  syncRemainingTime/PhoenixGameConfig.RankUpdateInterval));

        this.curTableInfo = BetTimeSyncPoint.Table;
        this.autoCashOutMultiplier = BetTimeSyncPoint.AutoCashOut;
        for (let i = 0; i < BetTimeSyncPoint.Players.length; i++) {
          if (BetTimeSyncPoint.Players[i].Id.toString() == globalThis.PlayerId) {
            this.InitMyPlayerInfo(BetTimeSyncPoint.Players[i]);
            break;
          }
        }

        for (let i = 0; i < BetTimeSyncPoint.Players.length; i++) {
          if (BetTimeSyncPoint.PlayersBet[i].Id.toString() == globalThis.PlayerId) {
            this.curBetList= BetTimeSyncPoint.PlayersBet[i].BetList;
            break;
          }
        }
        
        this.scheduleOnce(() => {
          this.ReplayCurrentSync();
        }, syncRemainingTime);
        CrashGameApp.Instance().chageState(CrashGameState.StartBet, syncPoint.SyncRemainingTime / 1000);
        break;
      }
      case "ShowdownSyncPoint": {
        let ShowdownSyncPoint: richcli.PhoenixProtocol.ShowdownSyncPoint =
          new richcli.PhoenixProtocol.ShowdownSyncPoint(syncPoint.Data);
        Progarm.log(
          `ShowdownSyncPoint: ${JSON.stringify(ShowdownSyncPoint)}`,
        );

        this.curTableInfo = ShowdownSyncPoint.Table;
        this.autoCashOutMultiplier = ShowdownSyncPoint.AutoCashOut;

        for (let i = 0; i < ShowdownSyncPoint.Players.length; i++) {
          if (ShowdownSyncPoint.Players[i].Id.toString() == globalThis.PlayerId) {
            this.InitMyPlayerInfo(ShowdownSyncPoint.Players[i]);
            break;
          }
        }
        for (let i = 0; i < ShowdownSyncPoint.Players.length; i++) {
          if (ShowdownSyncPoint.PlayersBet[i].Id.toString() == globalThis.PlayerId) {
            this.curBetList= ShowdownSyncPoint.PlayersBet[i].BetList;
            break;
          }
        }
        let timePassed = ShowdownSyncPoint.CurrentTime - ShowdownSyncPoint.StartTime;
        let startBetTimes = timePassed* ShowdownSyncPoint.Factor;
        ShowdownSyncPoint.Initial = ShowdownSyncPoint.Initial + startBetTimes;
        this.curShowDownStateData = ShowdownSyncPoint;
        this.curRoundMultiplier = ShowdownSyncPoint.Initial
        if(ShowdownSyncPoint.GameOver)
        {
          this.ReplayCurrentSync();
        }
        CrashGameApp.Instance().chageState(CrashGameState.StartShowdown, ShowdownSyncPoint);
        break;
      }
    }


  }

  async onGameStateMessage(msgType: string, syncId, time, content) {
    Progarm.error("====>onGameStateMessage: ", msgType, time);
    switch (msgType) {
      case "StartNewRound": {
        const RoundStartStateData: richcli.PhoenixProtocol.RoundStartState =
          new richcli.PhoenixProtocol.RoundStartState(content);

        let syncRemainingTime: number = Math.floor(
          time / 1000,
        );
        this.curRoundInfo = RoundStartStateData;
        CrashGameApp.Instance().chageState(CrashGameState.END, syncRemainingTime);

        this.curSyncId = syncId;
        this.scheduleOnce(() => {
         
          this.ReplayCurrentSync();
        }, syncRemainingTime);

      }
      break;
    case "StartBet": {
      this.curBetList = [];
      this.curBetCashOutList = [];
      this.curNotifyGameState = null;
      this.curShowDownStateData = null;
      this.curRoundMultiplier = 0;

      const BetTimeStateData: richcli.PhoenixProtocol.BetTimeState =
        new richcli.PhoenixProtocol.BetTimeState(content);
      // code...
      let syncRemainingTime: number = Math.floor(
        time / 1000,
      );

      CrashGameApp.Instance().chageState(CrashGameState.StartBet, syncRemainingTime);

      this.curSyncId = syncId;

      this.scheduleOnce(() => {
        this.ReplayCurrentSync();
      }, syncRemainingTime);

      this.schedule(() => {
        this.ReqGetBetRankingList();
      }, PhoenixGameConfig.RankUpdateInterval,Math.ceil(  syncRemainingTime/PhoenixGameConfig.RankUpdateInterval));
    }
    break;
    case "StartShowdown": {
      const ShowdownState: richcli.PhoenixProtocol.ShowdownState =
        new richcli.PhoenixProtocol.ShowdownState(content);
      // code...
      let syncRemainingTime: number = Math.floor(
        time / 1000,
      );
      Progarm.log(
        `StartShowdown: ${JSON.stringify(ShowdownState)}`,
      );
      this.curShowDownStateData = ShowdownState;

      CrashGameApp.Instance().chageState(CrashGameState.StartShowdown, ShowdownState);

      this.curSyncId = syncId;
      // this.scheduleOnce(() => {
      //   this.ReplayCurrentSync();
      // }, syncRemainingTime);
    }
    break;
    }
  }
//#endregion

//#region 数据接口
  getCurRoundAllBetMoney() {
    let totalBetMoney = 0;
    for (let i = 0; i < this.curBetList.length; i++) {
      let betItemData = this.curBetList[i];
      let cashOutData = betItemData.CashedOut?betItemData:this.getBetCashOutItem(betItemData.BetId);
      if (cashOutData==null) {
        totalBetMoney += betItemData.BetAmount * this.getCurRoundRate();
      } else {
        totalBetMoney += cashOutData.WinAmount;
      }
    }
    return totalBetMoney;
  }

  getBetCashOutItem(betID) {
    for (let i = 0; i < this.curBetCashOutList.length; i++) {
      let betItemData = this.curBetCashOutList[i];
      if (betItemData.BetId == betID) {
        return betItemData;
      }
    }
    return null;
  }

  isAllCashOut() {
    for (let i = 0; i < this.curBetList.length; i++) {
      let betItemData = this.curBetList[i];
      let isBetCaskOut = betItemData.CashedOut?true:this.isBetCashOUt(betItemData.BetId);
      if (!isBetCaskOut) {
        return false;
      }
    }
    return true;
  }

  isBetCashOUt(betID) {
    for (let i = 0; i < this.curBetCashOutList.length; i++) {
      let betItemID = this.curBetCashOutList[i].BetId;
      if (betItemID == betID) {
        return true;
      }
    }
    return false;
  }

  getCurRoundRate() {
    if (this.curNotifyGameState == null) {
      return this.curRoundMultiplier;
    }
    return this.curNotifyGameState.CurrentMultiplier;
  }

  getTotalWinMoney() {
    let totalWinMoney = 0;
    let totalBetMoney = 0;
    for (let i = 0; i < this.curBetList.length; i++) {
      let betItem = this.curBetList[i];
      totalBetMoney+= betItem.BetAmount;
      if(betItem.CashedOut)
      {
        totalWinMoney+= betItem.WinAmount;
      }
    }

    for (let i = 0; i < this.curBetCashOutList.length; i++) {
      let betItemData = this.curBetCashOutList[i];
      totalWinMoney += betItemData.WinAmount;
    }
    return Math.floor(totalWinMoney-totalBetMoney);
  }

  getHistoryRateRecords()
  {
    return this.lastHistoryRoundInfo;
  }

  InitMyPlayerInfo(playerInfo) {
    this.myPlayerInfo = playerInfo
  }
  //#endregion
}