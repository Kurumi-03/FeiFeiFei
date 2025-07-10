import { TextAsset, director, error, log, resources } from "cc";
import richcli from "../../proto/richsrv-cli.js";
import MsgDispatcher from "../../Script/Base/MsgDispatcher";
import Singleton from "../../Script/Base/Singleton";
import { tokon } from "../Global/tokon";
import StopWatch from "./StopWatch";
import Game_WebSocketController from "./Game_WebSocketController";
import { SceneGameName } from "./GameName";
import { SystemMsg } from "./SystemMsg";
import { Progarm } from "./Progarm";
import { SystemController } from "./SystemController";
export default class WebSocketControllerBase extends Singleton<WebSocketControllerBase> {
  private _WebSocketChannel: richcli.WebSocketChannel;
  protected VersionNumber: string = "";
  protected LoginMode: string = "";
  protected IP: string = "";
  protected isconnect: boolean = false;


  public async connectToServer() {
    
    try {


      this._WebSocketChannel = await richcli.WebSocketConnector.connect(
        globalThis.srv_ip_port,
        { onMessage: this.onMessage, onClose: this.onClose }
      );

      globalThis.isconnect = true;
      Game_WebSocketController.Instance(Game_WebSocketController).WaitTimeOut = 0;
      return true;
      
    } catch (e) {
      globalThis.isconnect = false;
      if (e instanceof Error) {
        Progarm.error("connectToServer:", e.name, e.message, e.stack);
      } else {
        Progarm.error("connectToServer:", e.message);
      }
      return null;
    }
  }

  public channel(): richcli.WebSocketChannel {

    return this._WebSocketChannel;
  }

  public Register_SendReceiptMessage(f: Function) {
    MsgDispatcher.Register("SendReceiptMessage", f);
  }
  protected SendReceiptMessage(t1: string, t2: any) {
    MsgDispatcher.Send("SendReceiptMessage", t1, t2);
  }
  public Register_SendStateMessage(f: Function) {
    MsgDispatcher.Register("SendStateMessage", f);
  }
  protected SendStateMessage(
    T1: any = null,
    T2: any = null,
    T3: any = null,
    T4: any = null
  ) {
    MsgDispatcher.Send("SendStateMessage", T1, T2, T3, T4);
  }
  public Register_onClose(f: Function) {
    MsgDispatcher.Register("onGameSrvDisconnect", f);
  }
  private onClose() {
    Progarm.log("GameSrvDisconnect");
    MsgDispatcher.Send("onGameSrvDisconnect");
    // const systemController_ = SystemController.Instance();
    // systemController_.checkMaintenanceStatus();

    if (SystemMsg.Instance()) {
      //SystemMsg.Instance().ShortMsg("與伺服器連線失敗", 3, 1);
    }

  }
  protected onMessage(type: string, payload: Uint8Array) {
    //log("SocketMessage:" + type);
    try {
      switch (type) {
        case "game.SendReceiptMessage":
          {
            /*
                        針對 Server 所傳送的請求, 一般都會有三種訊息定義:
                        1. xxxRequest: 對 Server 發送請求.
                        2. xxxResponse: Server 針對不合法請求所做出的回應. 正常來說 xxxResponse 沒有定義任何欄位, 只要請求不合法, 就會以 Exception 的形式通知. Client 可以使用 ErrorCode 判斷請求失敗原因.
                        3. xxxReceipt: Server 針對合法請求所做出的回應. 考慮未來遊戲歷程的建置與即時入局玩家的同步, 故以 xxxReceipt 取代 xxxResponse.
                        */
            const receiptMessage =
              new richcli.JuYouGamesProtocol.ReceiptMessage(payload);
            console.log(
              "onReceive game.SendReceiptMessage:" + receiptMessage.MessageType
            );
            WebSocketControllerBase.Instance(
              WebSocketControllerBase
            ).SendReceiptMessage(
              receiptMessage.MessageType,
              receiptMessage.MessageContent
            );
          }
          break;
        case "game.SendStateMessage":
          {
            /*
                        只要 Server 遊戲狀態變更, 就會以此種方式通知.
                        一般來說, 每個狀態階段會伴隨一個 SyncId, 表示在此狀態即將結束時需要做同步
                        */
            // 回應同步的方式:
            // const syncId = stateMessage.SyncId; // 若 syncId 為 0, 表示此狀態不需要同步
            // await socketChannel.sendRequest(
            //   'blackjack@1.ReplySync',
            //   GameBaseProtocol.ReplySyncRequest({ TableToken: '', SyncId: syncId })
            // );
            //stateMessage.SyncTime
            const stateMessage = new richcli.JuYouGamesProtocol.StateMessage(
              payload
            );
            console.log(
              "onReceive game.SendStateMessage:" +
              stateMessage.MessageType +
              ", syncId=" +
              stateMessage.SyncId
            );
            WebSocketControllerBase.Instance(
              WebSocketControllerBase
            ).SendStateMessage(
              stateMessage.MessageType,
              stateMessage.SyncId,
              stateMessage.SyncTime,
              stateMessage.MessageContent
            );
            // tokon.getInstance().SyncId = stateMessage.SyncId;
            // log(
            //   tokon.getInstance().SyncId,
            //   "tokon.getInstance().SyncId"
            // );
          }
          break;
      }
    } catch (e) {
      if (e instanceof Error) {
        Progarm.error("onMessage error:", e.name, e.message, e.stack);
      } else {
        Progarm.error("onMessage error:", e.message);
      }

    }
  }


  public GetLoginMode(T1: any = null): string {

    if (this.LoginMode == "") {
      resources.load('LoginMode', (err: any, res: TextAsset) => {
        if (err) {
          error(err.message || err);
          return;
        }

        // 获取到文本数据
        this.LoginMode = res.text;
        if (T1 != null) {
          T1(this.LoginMode);
        }


      })
    } else {
      if (T1 != null) {
        T1(this.LoginMode);
      }
      return this.LoginMode;
    }

  }
  public GetIP(T1: any = null): string {
    if (this.IP == "") {
      resources.load('IP', (err: any, res: TextAsset) => {
        if (err) {
          error(err.message || err);
          return;
        }

        // 获取到文本数据
        this.IP = res.text;
        if (T1 != null) {
          T1(this.IP);
        }


      })
    } else {
      if (T1 != null) {
        T1(this.IP);
      }
      return this.IP

    }

  }

}
