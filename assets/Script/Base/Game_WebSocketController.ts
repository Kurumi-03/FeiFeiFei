
import { Game, _decorator, Node, director, game, sys, RichText } from 'cc';
import richcli from "../../proto/richsrv-cli.js";
import WebSocketControllerBase from "./WebSocketControllerBase";
import MsgDispatcher from './MsgDispatcher';
import { SystemMsg } from './SystemMsg';
import { PREVIEW } from 'cc/env';
import { TimerManager } from '../Lobby/TimerManager';
import { NetworkManager } from './NetworkManager';
import { SystemController } from './SystemController';
import { Progarm } from './Progarm';
import { DevSceneGameName, SceneGameName, ServerGameName, mapSceneNameToServerGameNum, mapServerToSceneGameName } from './GameName';
import { tokon } from '../Global/tokon';
import Logger from './Logger';


export default class Game_WebSocketController extends WebSocketControllerBase {

    public WaitTimeOut: number = 0;
    public pingTimeID: string = "";
    public SendRequestTimeOut: string = "";
    public SendRequestTimeOutIDArr: string[] = [];
    public isConnecting: boolean = false

    async PlatformData(PlayerToken: string, Account: string, NickName: string, Photo: string) {
        try {

        } catch (e) {
            if (e instanceof Error) {
                Progarm.error("", e.name, e.message, e.stack);
            } else {
                Progarm.error("", e.message);
            }

        }
        try {
            let PlatformDataRequest_ = new richcli.GameLobbyProtocol.PlatformDataRequest();
            PlatformDataRequest_.PlayerToken = PlayerToken;
            PlatformDataRequest_.Account = Account;
            PlatformDataRequest_.NickName = NickName;
            PlatformDataRequest_.Photo = Photo;
            Progarm.log("PlatformDataRequest_", JSON.stringify(PlatformDataRequest_))
            let PlatformData_ = await Game_WebSocketController.Instance(Game_WebSocketController).SendRequestConfirm('gamelobby.PlatformData', PlatformDataRequest_);
            Progarm.log("PlatformData_", JSON.stringify(PlatformData_))
        } catch (e) {
            if (e instanceof Error) {
                Progarm.error("PlatformData", e.name, e.message, e.stack);
            } else {
                Progarm.error("PlatformData", e.message);
            }

        }

    }
    async SendRequestConfirm(type: string, payload: any, timeOut: number = 10, useRequest: boolean = true) {
        const controller_ = Game_WebSocketController.Instance(Game_WebSocketController);
        if (!controller_) return undefined;
        if (this.isConnecting) {
            try {
                Progarm.log("SendRequestConfirm 連接操作正在進行，請稍候...", type);

            } catch (error) {
                Progarm.log("SendRequestConfirm 連接操作正在進行，請稍候...", type);// 將無法序列化的值轉換為字符串

            }

            return undefined;
        }
        if (!NetworkManager.Instance().checkInitialNetworkStatus()) {
            SystemMsg.Instance().Show("請確認您的網路是否開啟", 1);
            return undefined;
        }
        if (!controller_.channel().isSocketConnected() && !globalThis.isRe) {
            var currentScene = director.getScene();
            var sceneName = currentScene.name;
            if (currentScene && sceneName in SceneGameName) {

            } else {

                Progarm.log("SendRequestConfirm ReLobbyLogin");
                Game_WebSocketController.Instance(Game_WebSocketController).ReLobbyLogin();
            }

            return undefined;
        }
        if (type != "connector@1.Ping") {
            try {
                Progarm.log("SendRequestConfirm_send", type, JSON.stringify(payload));

            } catch (error) {
                Progarm.log("SendRequestConfirm_send", type, String(payload));// 將無法序列化的值轉換為字符串

            }

        }
        let timeoutDuration = timeOut * 1000;; // 設置 timeout 時間，單位為毫秒

        let timeID = TimerManager.Instance().scheduleOnceSelf(() => {
            //Progarm.log("SendRequestConfirm-timeout", type);
            MsgDispatcher.Send("SendRequestIsTimeOut", type, payload)
            controller_.SendRequestTimeOutIDArr.forEach(element => {
                TimerManager.Instance().unscheduleSelf(element);
            });
            controller_.SendRequestTimeOutIDArr = [];
        }, timeoutDuration)
        controller_.SendRequestTimeOutIDArr.push(timeID);
        let data; // 將 data 初始化為 undefined
        let isResolved = false; // 追蹤 Promise 是否已經被解決
        // 創建一個 Promise 對象來表示 timeout
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!isResolved) { // 只有在 Promise 未被解決時才拒絕
                    reject(new Error('Request timed out')); // timeout 時間到，拒絕 Promise
                }
            }, timeoutDuration);
        });
        const handleChannelClosed = async () => {
            Progarm.log("消息通道在接收回應前關閉，嘗試重新連接", type);
            // 這裡應該添加重新連接的邏輯，例如：
            // await controller_.reconnect();
            // 重新發送請求
            Game_WebSocketController.Instance(Game_WebSocketController).ReLobbyLogin();
            return undefined;
        };
        try {
            if (useRequest) {
                data = await Promise.race([
                    controller_.channel().sendRequest(type, payload),
                    timeoutPromise
                ]);
            } else {
                data = await Promise.race([
                    controller_.channel().sendMessage(type, payload),
                    timeoutPromise
                ]);
            }
            isResolved = true;
            if (type != "connector@1.Ping") {
                Progarm.log('Request successful:', type);

            }

        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("message channel closed")) {
                    // 處理消息通道關閉的情況
                    return handleChannelClosed();
                }
                Progarm.error("Request failed:", error.name, error.message, error.stack, type);
            } else {
                Progarm.error("Request failed:", String(error), type);
            }
            Progarm.error('Request failed:', error.message, type);
            // const systemController_ = SystemController.Instance();
            // systemController_.checkMaintenanceStatus();
            SystemMsg.Instance().ShowLoading(false, "-1");
            data = undefined;
        } finally {
            TimerManager.Instance().unscheduleSelf(timeID);
        }

        return data;
    }


    SendPingMessage(_key: number) {
        const controller_ = Game_WebSocketController.Instance(Game_WebSocketController);
        if (!controller_) return;
        try {

            let PingMessage_ = new richcli.ConnectorProtocol.PingMessage();
            PingMessage_.Key = _key;
            //Progarm.log("PingMessage_", JSON.stringify(PingMessage_));
            controller_.SendRequestConfirm(`connector@1.Ping`, PingMessage_, 10, false);
        } catch (e) {
            if (e instanceof Error) {
                Progarm.error("SendPingMessage", e.name, e.message, e.stack);
            } else {
                Progarm.error("SendPingMessage", e.message);
            }
            controller_.WaitTimeOut = 0;

        }


    }
    protected SendReceiptMessage(t1: string, t2: any) {
        MsgDispatcher.Send("SendReceiptMessage", t1, t2)
    }
    public SendStateMessage(T1: any = null, T2: any = null, T3: any = null, T4: any = null) {
        MsgDispatcher.Send("SendStateMessage", T1, T2, T3, T4)
    }
    protected onMessage(type: string, payload: Uint8Array) {
        if (type != "connector.Pong" && type != "game.SendReceiptMessage" && type != "game.SendStateMessage") {
            Progarm.log("SocketMessage:" + type);
        }

        //super.onMessage(type, payload);
        const controller_ = Game_WebSocketController.Instance(Game_WebSocketController);
        controller_.WaitTimeOut = 0;
        try {
            let types = type.split('.');

            switch (types[0]) {
                case "GameLobbyProtocol":

                    break;
                default:
                    {
                        switch (type) {
                            case 'game.SendReceiptMessage':
                                {
                                    /*
                                    針對 Server 所傳送的請求, 一般都會有三種訊息定義:
                                    1. xxxRequest: 對 Server 發送請求.
                                    2. xxxResponse: Server 針對不合法請求所做出的回應. 正常來說 xxxResponse 沒有定義任何欄位, 只要請求不合法, 就會以 Exception 的形式通知. Client 可以使用 ErrorCode 判斷請求失敗原因.
                                    3. xxxReceipt: Server 針對合法請求所做出的回應. 考慮未來遊戲歷程的建置與即時入局玩家的同步, 故以 xxxReceipt 取代 xxxResponse.
                                    */
                                    const receiptMessage = new richcli.JuYouGamesProtocol.ReceiptMessage(payload);
                                    Progarm.log("onReceive game.SendReceiptMessage:" + receiptMessage.MessageType);

                                    switch (receiptMessage.MessageType) {
                                        case 'GetUsedChips':
                                            {
                                                MsgDispatcher.Send("GetUsedChipsReceipt", receiptMessage.MessageType, receiptMessage.MessageContent)
                                            }
                                            break;
                                        case 'GamePlayerList':
                                            {
                                                MsgDispatcher.Send("GamePlayerListReceipt", receiptMessage.MessageType, receiptMessage.MessageContent)
                                            }
                                            break;
                                        case 'Chat':
                                            {
                                                MsgDispatcher.Send("ChatReceipt", receiptMessage.MessageType, receiptMessage.MessageContent)
                                            }
                                            break;
                                        default:
                                            controller_.SendReceiptMessage(receiptMessage.MessageType, receiptMessage.MessageContent)

                                            break;

                                    }

                                }
                                break;

                            case 'game.SendStateMessage':
                                {


                                    const stateMessage = new richcli.JuYouGamesProtocol.StateMessage(payload);
                                    Progarm.log("---【onReceive game.SendStateMessage:" + stateMessage.MessageType + ", syncId=" + stateMessage.SyncId + ", syncTime=" + stateMessage.SyncTime + "】"
                                    );

                                    controller_.SendStateMessage(stateMessage.MessageType, stateMessage.SyncId, stateMessage.SyncTime, stateMessage.MessageContent)


                                }
                                break;
                            case 'game.StartNewRound':
                                {




                                    const stateMessage = new richcli.JuYouGamesProtocol.StartNewRoundMessage(payload);
                                    Progarm.log("---【onReceive game.StartNewRound", JSON.stringify(stateMessage));
                                    MsgDispatcher.Send("game.StartNewRound", type, payload)

                                }
                                break;
                            case 'connector.Pong':
                                {
                                    controller_.WaitTimeOut = 0;
                                    controller_.SendPingMessage(new richcli.ConnectorProtocol.PongMessage(payload).Key);
                                    break;
                                }
                            case 'ClubAgentReviewListReceipt':
                                {
                                    MsgDispatcher.Send("ClubAgentReviewListReceipt", type, payload)
                                    break;
                                }



                        }
                    }
                    break;
            }

        } catch (e) {
            console.error(e);
            if (e instanceof Error) {
                Progarm.error("onMessage error", e.name, e.message, e.stack);
            } else {
                Progarm.error("onMessage error", e.message);
            }
        }

    }

    //進入後台
    OnEVENT_HIDE() {
        Game_WebSocketController.Instance(Game_WebSocketController).isBackground = true;

    }
    //進入前台
    OnEVENT_SHOW() {
        Game_WebSocketController.Instance(Game_WebSocketController).isBackground = false;
    }
    async sleep(time: number): Promise<void> {
        return new Promise<void>((res, rej) => {
            setTimeout(res, time);
        });
    }
    //用LobbyInfo確認連線
    async CheckLobbyConnect() {
        try {
            let LobbyInfoRequest_ = new richcli.GameLobbyProtocol.LobbyInfoRequest();
            LobbyInfoRequest_.PlayerToken = globalThis.PlayerToken;
            const systemController_ = SystemController.Instance();


            let LobbyInfo_ = await Game_WebSocketController.Instance(Game_WebSocketController).SendRequestConfirm('gamelobby.LobbyInfo', LobbyInfoRequest_, 10);
            if (LobbyInfo_) {
                systemController_.LobbyInfoResponse = new richcli.GameLobbyProtocol.LobbyInfoResponse(LobbyInfo_);
                Logger.logLevel=systemController_.LobbyInfoResponse.DebugLevel;
                MsgDispatcher.Send("ReEnterLobby", new richcli.GameLobbyProtocol.LobbyInfoResponse(LobbyInfo_), "Club");
                return true;
            }
            return false;

        } catch (e) {
            if (e instanceof Error) {
                Progarm.error("CheckLobbyConnect", e.name, e.message, e.stack);
            } else {
                Progarm.error("CheckLobbyConnect", e.message);
            }
            return false;
        }


    }
    async ReLobbyLogin() {
        try {
            if (!NetworkManager.Instance().checkInitialNetworkStatus()) {
                SystemMsg.Instance().Show("請確認您的網路是否開啟", 1);
                return;
            }
            if (this.isConnecting) {
                Progarm.log("連接操作正在進行，請稍候...");
                return;
            }
            if (globalThis.isRe == true) {
                return;
            }
            var currentScene = director.getScene();
            var sceneName = currentScene.name;
            if (currentScene && sceneName in SceneGameName) {
                const systemController_ = SystemController.Instance();
                systemController_.ReConnectToServer();
                return;
            }
            Progarm.log(" ReLobbyLogin ReConnectToServer");
            const controller = Game_WebSocketController.Instance(Game_WebSocketController);
            let value;
            let LoginMode = sys.localStorage.getItem('LoginMode');
            if (LoginMode) {

            } else {
                LoginMode = "default";
            }
            const systemController_ = SystemController.Instance();
            switch (LoginMode) {
                case "default":
                    if (!globalThis.isRe) {
                        if (sys.isBrowser) {
                            let params = new URLSearchParams(location.search);

                            if (params.get("token")) {
                                value = params.get("token");
                            } else {
                                value = sys.localStorage.getItem('PlayerToken');
                            }

                        } else {
                            value = sys.localStorage.getItem('PlayerToken');
                        }

                    }
                    break;
                case "Line":
                    if (!globalThis.isRe) {
                        if (sys.isBrowser) {
                            let params = new URLSearchParams(location.search);

                            if (params.get("token")) {
                                value = params.get("token");
                            } else {
                                value = sys.localStorage.getItem('PlayerToken');
                            }

                        } else {
                            value = sys.localStorage.getItem('PlayerToken_Line');
                        }
                    }
                    break;
            }
            if (PREVIEW || !sys.isNative) {
                if (globalThis.testAccToken != "") {
                    value = globalThis.testAccToken;
                }

            }

            if (value) {// have PlayerToken




                SystemMsg.Instance().ShowLoading(true, "-1");


                let connectInfo = await controller.ReConnectToServer();
                if (connectInfo == null) {
                    this.isConnecting = false; // 重置旗標
                    SystemMsg.Instance().Show("連線中斷，請重新連線。", 1);


                    SystemMsg.Instance().ShowLoading(false, "-1");
                    return null;
                } else if (connectInfo == false) {
                    this.isConnecting = false; // 重置旗標
                    SystemMsg.Instance().ShowLoading(false, "-1");
                    return null;
                }

                await controller.VerifyPlayerToken(value);
                if (director.getScene().name != "Lobby") {
                    SystemMsg.Instance().ShowLoading(false, "-1");
                }

                this.isConnecting = false; // 重置旗標
            }
            else {
                SystemMsg.Instance().ShowLoading(false, "-1");
                this.isConnecting = false; // 重置旗標
                director.loadScene('Loading');
            }

        } catch (e) {
            SystemMsg.Instance().ShowLoading(false, "-1");
            if (e instanceof Error) {
                Progarm.error(e.name, e.message, e.stack);
            } else {
                Progarm.error(e.message);
            }

        }

    }

    async VerifyPlayerToken(value, mode: number = -1, txtNode: Node = null) {
        const controller = Game_WebSocketController.Instance(Game_WebSocketController);
        const systemController_ = SystemController.Instance();
        const request = new richcli.GameLobbyProtocol.VerifyPlayerTokenRequest();
        request.PlayerToken = value;
        request.Version = systemController_.VersionNumber;

        try {
            const VerifyPlayerToken = await controller.SendRequestConfirm('gamelobby.VerifyPlayerToken', request);
            if (VerifyPlayerToken == null) {
                SystemMsg.Instance().Show("登入失敗", 2);
                return;

            }
            let response = new richcli.GameLobbyProtocol.VerifyPlayerTokenResponse(VerifyPlayerToken);
            Progarm.log("GameLobby.VerifyPlayerToken", JSON.stringify(response));

            switch (response.State) {
                case 1:  // 登入成功
                    globalThis.PlayerToken = response.PlayerToken;
                    // let params = new URLSearchParams(location.search);
                    // let _mitkn=""
                    // if (params.get("token")) {
         
                    // } else if (params.get("mitkn")) {
                    //     sys.localStorage.setItem('mitknPlayerToken', globalThis.PlayerToken);
                        
                    // }
                    systemController_.ChangeManifest("",globalThis.PlayerToken)
                    sys.localStorage.setItem('PlayerToken', globalThis.PlayerToken);

                    globalThis.ReLogin = "";
                    if (txtNode != null) {
                        txtNode.getComponent(RichText).string = "登入成功！！";
                    }
                    let resp = await systemController_.GetLobbyInfo();
                    // if (txtNode != null) {
                    //     if (!resp) {
                    //         txtNode.getComponent(RichText).string = "無法連接到大廳，請聯繫客服。";
                    //     }
                    // }

                    break;
                case 2:  // 重複登入
                    globalThis.ReLogin = "close";
                    controller.channel().close();
                    if (mode == 0) {
                        SystemMsg.Instance().Show("重複登入", 2);
                        //globalThis.isconnect = false;
                    } else {
                        director.loadScene('Loading');
                    }
                    break;
                case 3:  // 版本不符
                    globalThis.ReLogin = "close";
                    controller.channel().close();
                    if (mode == 0) {
                        SystemMsg.Instance().Show2("版本不符,請更新遊戲", this.GOAppleStore.bind(this), 0);
                        globalThis.isconnect = false;
                    } else {
                        director.loadScene('Loading');
                    }

                    break;
                case 4:  // 重新入局
                    globalThis.PlayerToken = response.PlayerToken;
                    globalThis.PlayerId = response.PlayerId.toString();
                    globalThis.ReLogin = "";

                    let value = sys.localStorage.getItem('ReJoinGame');
                    let value1 = sys.localStorage.getItem('roomtoken');
                    let value2 = sys.localStorage.getItem('RoomKey');
                    // let APiGameId = sys.localStorage.getItem('APiGameId'+ globalThis.MemberId);
                    // if(APiGameId){
                    //     let APiGameListId = sys.localStorage.getItem('APiGameListId'+ globalThis.MemberId);
                    //     let APiGameClub = sys.localStorage.getItem('APiGameClub'+ globalThis.MemberId);
                    //     await OtherGameManager.Instance().BackFromAPIGame(APiGameId, APiGameListId,APiGameClub);
                    //     systemController_.GetLobbyInfo();
                    //     return;
                    // }
                    if (!value1) {
                        systemController_.GetLobbyInfo();
                        return;
                    }

                    let CliReJoinGameRequest_ = new richcli.GameLobbyProtocol.CliReJoinGameRequest();
                    CliReJoinGameRequest_.TableToken = value1;
                    if (value) {
                        CliReJoinGameRequest_.ClubId = value;
                    } else {
                        CliReJoinGameRequest_.ClubId = "";
                    }
                    Progarm.log("CliReJoinGameRequest_", JSON.stringify(CliReJoinGameRequest_));
                    if (txtNode != null) {
                        txtNode.getComponent(RichText).string = "正在重新連接到遊戲，感謝您的耐心等待... 100%";
                    }

                    let CliReJoinGame = await Game_WebSocketController.Instance(Game_WebSocketController).channel().sendRequest('gamelobby.CliReJoinGame', CliReJoinGameRequest_);
                    let CliReJoinGameResponse_ = new richcli.GameLobbyProtocol.CliReJoinGameResponse(CliReJoinGame);

                    Progarm.log("CliReJoinGameResponse_", JSON.stringify(CliReJoinGameResponse_));
                    let ServerGameEnum = ServerGameName[CliReJoinGameResponse_.GameName as keyof typeof ServerGameName];
                    let serverGameNum = mapServerToSceneGameName(ServerGameEnum);
                    //1:成功，玩家可以送出entergame 2:該遊戲局已經解散(玩家留在大廳即可) 3:clubid對應錯誤 4:玩家不是重新入局的狀態
                    if (CliReJoinGameResponse_.State == 1) {
                        if (CliReJoinGameResponse_.GameName in ServerGameName) {
                            tokon.getInstance().roomTokon = value1;
                            globalThis.Roomtoken = value1;
                            globalThis.RoomKey = value2
                            
                            globalThis.NowGameName = CliReJoinGameResponse_.GameName;
                            globalThis.gameSrvName = CliReJoinGameResponse_.Srvname;
                            if (value == "") {
                                globalThis.LobbyClubStep = "0";
                            } else {
                                globalThis.LobbyClubStep = value;
                                globalThis.ClubId = globalThis.LobbyClubStep;
                            }
                            globalThis.isGameMaintenance = 0;
                            Progarm.InLoadingLoadScene("Phoenix");

                        } else {
                            //Progarm.InLoadingLoadScene("Lobby");
                        }

                    } else if (CliReJoinGameResponse_.State == 5) {
                        SystemMsg.Instance().ShowMaintenance("玩家已在其他遊戲中");
                    } else {
                        //this.loadingbg.active = true;
                        //Progarm.InLoadingLoadScene("Lobby");
                    }
                    break;
                case 5:

                    SystemMsg.Instance().ShowMaintenance("「系統維護中……」");
                    globalThis.isconnect = false;
                    globalThis.ReLogin = "close";
                    controller.channel().close();

                    break;
                case 6:
                    SystemMsg.Instance().Show("玩家帳號被其他裝置使用,目前遊戲中", 2);
                    globalThis.isconnect = false;
                    globalThis.ReLogin = "close";
                    controller.channel().close();

                    break;
                default:  // 登入失敗
                    globalThis.ReLogin = "close";
                    controller.channel().close();

                    if (mode == 0) {
                        SystemMsg.Instance().Show("登入失敗", 2);
                        globalThis.isconnect = false;
                    } else {
                        director.loadScene('Loading');
                    }

                    break;
            }
        } catch (e) {
            if (e instanceof Error) {
                Progarm.error("Error during VerifyPlayerToken", e.name, e.message, e.stack);
            } else {
                Progarm.error("Error during VerifyPlayerToken", e.message);
            }

            director.loadScene('Loading');
            globalThis.ReLogin = "close";
            controller.channel().close();


        }

        globalThis.isRe = false;
    }
    GOAppleStore() {
        if (sys.isBrowser) {

        } else {
            sys.openURL('https://apps.apple.com/app/6473881113');
        }

    }
    clearStorageIfNeeded() {
        const systemController_ = SystemController.Instance();
        const versionNumber = systemController_.VersionNumber;
        const parts = versionNumber.split(".");
        if (parts.length === 3 && ((parts[0] === "0" && parts[1] === "0" && Number(parts[2]) < 60) || PREVIEW)) {
            sys.localStorage.clear();
        }
    }
    async ReConnectToServer() {

        if (this.isConnecting) {
            Progarm.log("連接操作正在進行，請稍候...");
            return false;
        }
        if (!globalThis.isconnect) {
            return false;
        }
        const systemController_ = SystemController.Instance();
        if (systemController_.isInBackground == true) {
            return false;
        }

        globalThis.isGameAccessDenied = true;
        this.isConnecting = true; // 設置旗標為 true，表示連接操作正在進行
        const controller_ = Game_WebSocketController.Instance(Game_WebSocketController);
        const startTime = Date.now(); // 使用 Date.now() 獲取開始時間戳

        // 檢查初始網路狀態
        if (!NetworkManager.Instance().checkInitialNetworkStatus()) {
            SystemMsg.Instance().Show("請確認您的網路是否開啟", 1);
            this.isConnecting = false; // 重置旗標
            //throw new Error("網路未開啟");  // 使用 throw 拋出錯誤
            return false;
        }

        Progarm.log("ReConnectToServer.....", globalThis.srv_ip_port);
        try {
            // 檢查當前的 WebSocket 連接狀態
            if (!controller_.channel() || !controller_.channel().isSocketConnected()) {
                Progarm.log("正在連接到伺服器...");
                let connectInfo = await controller_.connectToServer(); // 如果未連接則連接到伺服器
                if (connectInfo == null) {
                    this.isConnecting = false;
                    systemController_.checkMaintenanceStatus();
                    return null;
                }
            } else {
                Progarm.log("正在關閉當前連接並重新連接...");
                controller_.channel().close(); // 關閉當前連接
                await new Promise(resolve => setTimeout(resolve, 500)); // 停0.5秒
                let connectInfo = await controller_.connectToServer();
                if (connectInfo == null) {
                    this.isConnecting = false;
                    systemController_.checkMaintenanceStatus();
                    return null;
                }
            }
        } catch (e) {
            // 捕獲連接過程中的錯誤並記錄
            if (e instanceof Error) {
                Progarm.error("處理連接過程中發生錯誤:", e.name, e.message, e.stack);
            } else {
                Progarm.error("處理連接過程中發生錯誤:", e.message);
            }

            this.isConnecting = false; // 重置旗標
            //throw new Error("連接失敗，請稍後再試"); // 拋出新的錯誤信息
            systemController_.checkMaintenanceStatus();
            return null;
        }

        const endTime = Date.now(); // 使用 Date.now() 獲取結束時間戳
        const timeDiff = (endTime - startTime) / 1000; // 計算秒差
        Progarm.log("ReConnectToServer.....結束", `耗時 ${timeDiff} 秒`);

        // 發送 Ping 消息以確保連接保持活躍
        controller_.SendPingMessage(0);
        this.isConnecting = false; // 重置旗標
        return true;
    }

    async closeAndReconnect(): Promise<void> {
        const controller_ = Game_WebSocketController.Instance(Game_WebSocketController);
        controller_.channel().close(); // 關閉當前連接
        return new Promise<void>((resolve, reject) => {
            const maxAttempts = 5; // 最大嘗試次數
            let attempts = 0; // 當前嘗試次數

            const interval = setInterval(async () => {
                attempts++;
                // 檢查當前連接是否已關閉
                if (!controller_.channel().isSocketConnected()) {
                    Progarm.log("連接已關閉");
                    clearInterval(interval); // 停止定時器
                    try {
                        // 嘗試重新連接

                        Progarm.log("重新連接成功");
                        resolve();
                    } catch (error) {
                        Progarm.error("重新連接失敗", error.message);
                        reject(error); // 處理連接錯誤
                    }
                } else if (attempts >= maxAttempts) {
                    Progarm.error("連接關閉超時");
                    clearInterval(interval); // 停止定時器
                    reject(new Error("連接關閉超時"));
                }
            }, 1000); // 每秒檢查一次
        });
    }



    protected onDestroy(): void {
        Game_WebSocketController.Instance(Game_WebSocketController).unscheduleAllCallbacks();

    }
    private isBackground: boolean = false;
    public tmpData: any[] = [];

}

