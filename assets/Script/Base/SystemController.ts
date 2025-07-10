import { _decorator, Component, Director, director, Enum, Game, game, instantiate, Prefab, sys, CCString, CCBoolean, CCInteger, macro, view, Canvas, UITransform, screen, Size, ResolutionPolicy, resources, sp, SpriteAtlas, Asset, NodePool, log, error, profiler, EventTouch, settings, Settings, Label, Button } from 'cc';
import richcli from "../../proto/richsrv-cli.js";
import { MiIP, TestAccToken } from './MiIP';
import { DevSceneGameName, mapDevToSceneGameName, mapSceneNameToServerGameNum, mapSceneNameToServerGameStr, mapSceneToServer, SceneGameName } from './GameName';
import Game_WebSocketController from './Game_WebSocketController';
import { tokon } from '../Global/tokon';
import { SystemMsg } from './SystemMsg';
import { PREVIEW } from 'cc/env';
import MsgDispatcher from './MsgDispatcher';
import { Progarm } from './Progarm';
import { MiSystemAsset } from './MiSystemAsset';
import { SystemResources } from './SystemResources';
import Logger from './Logger';
import { AudioMgr } from './AudioMgr';
const { ccclass, property, executionOrder } = _decorator;
interface ExtendedError extends Error {
    fileName?: string;
    lineNumber?: number;
    columnNumber?: number;
}
class GameRoom {
    enterGameSeats: number[] = [1, 2, 3, 4];

    enterSeat(index: number) {
        if (index < 0 || index >= this.enterGameSeats.length) {
            throw new Error(`無效的座位索引: ${index}`);
        }
        return this.enterGameSeats[index];
    }
}
class GameState {
    GameId: string;
    progress: number;
    state: number;

}
Enum(DevSceneGameName); // 將 SceneGameName 枚舉註冊到屬性檢查器中
Enum(MiIP); // 將 MiIP 枚舉註冊到屬性檢查器中
Enum(TestAccToken); // 將 MiIP 枚舉註冊到屬性檢查器中
@ccclass('SystemController')
@executionOrder(-1)
export class SystemController extends Component {


    private static _instance: SystemController = null;


    @property({ group: { name: '測試模式', id: '2' }, type: TestAccToken }) // 將類型設置為 MiIP 枚舉
    TestAccToken: TestAccToken = TestAccToken.NULL;
    @property({ group: { name: '伺服器位置', id: '3' }, type: MiIP }) // 將類型設置為 MiIP 枚舉
    IP: MiIP = MiIP.MiIP_NULL;

    @property({ group: { name: '版號', id: '4' } })
    VersionNumber: string = "V0.0.0";

    @property({ group: { name: '開發模式直接進入遊戲', id: '5' }, type: DevSceneGameName })
    DevGame: DevSceneGameName = DevSceneGameName.Null;
    isInBackground: boolean = false;
    isMateGame: boolean = false;

    private funList: { targetFrame: number, callback: () => void }[] = [];
    private curTime: number = 0;
    private curFrame: number = 0;

    public LobbyInfoResponse: richcli.GameLobbyProtocol.LobbyInfoResponse;
    public ClubTableInfoReceipt_tmp: richcli.GameLobbyProtocol.ClubTableInfoReceipt;
    public ApiGameGetGameListReceipt_tmp: richcli.GameLobbyProtocol.ApiGameGetGameListReceipt;
    public loadGameArr: GameState[] = [];

    public spinePool = new NodePool();


    public static Instance() {
        if (this._instance == null) {
            this._instance = new SystemController();
        }
        return this._instance;
    }

    onLoad() {

    
        SystemController._instance = this;
        const systemController_ = SystemController.Instance();


        try {
            if (sys.os == sys.OS.ANDROID) {
                if (sys.isBrowser) {

                    
                }
            }
            else if (sys.os == sys.OS.IOS) {
    
                if (sys.isBrowser) {
    
                }
            }
            if (!PREVIEW) {
                console.log = function () {
                    // 創建一個 Error 物件來獲取堆疊追蹤
                    const error = new Error();

                    // 解析堆疊追蹤以獲取呼叫位置
                    const stackLines = error.stack.split('\n');
                    let callerLine = stackLines[2]; // 第三行通常是呼叫者的位置

                    // 提取文件名和行號
                    const match = callerLine.match(/\((.+):(\d+):(\d+)\)/);
                    let location = 'Unknown location';
                    if (match) {
                        const [, file, line, column] = match;
                        location = `${file}:${line}:${column}`;
                    }

                    // 將位置資訊添加到日誌中
                    const args = Array.from(arguments);
                    args.push(`\n(called from ${location})`);

                    // 調用原始的 log 函數
                    log.apply(console, args);
                    
                };
                console.error = function () {

                };
            }



            settings.overrideSettings(Settings.Category.PROFILING, "showFPS", true)
            director.addPersistRootNode(SystemController._instance.node);
            macro.ENABLE_MULTI_TOUCH = false;
            globalThis.LoadingMsg = "";
            globalThis.ImgHeadArray = [];
            try {
                if (sys.localStorage.getItem("ShortMusic") && sys.localStorage.getItem("LongMusic")) {
                    globalThis.ShortMusic = sys.localStorage.getItem("ShortMusic");
                    globalThis.LongMusic = sys.localStorage.getItem("LongMusic");
                } else {
                    globalThis.LongMusic = 0.8;
                    globalThis.ShortMusic = 0.8;
                }

            } catch (e) {
                globalThis.LongMusic = 0.8;
                globalThis.ShortMusic = 0.8;
            }


            globalThis.ClubId = "";
            globalThis.NowGameName = "";
            globalThis.isGameAccessDenied = true;
            globalThis.isconnect = true;
            globalThis.testAccToken = "";

            switch (systemController_.IP) {
                case MiIP.MiIP_wsstest:
                    globalThis.srv_ip_port = "wss://wss3.9pkpoker.com";

                    break;

            }

            switch (systemController_.TestAccToken) {

                case TestAccToken.test1:
                    globalThis.testAccToken = "a4cccc5c-bdbb-43f4-ae9d-30e9077d2787";
                    break;




            }
            if (sys.isNative) {
                (window as any).window.__errorHandler = function (message, source, lineno, colno, error) {
                    let exception: any = {};
                    exception.message = message;
                    exception.source = source;
                    exception.lineno = lineno;
                    exception.colno = colno;
                    exception.error = error ? error.stack : null; // 如果有 error 物件，則記錄其堆疊訊息
                    Progarm.error(JSON.stringify(exception));



                };
            } else if (sys.isBrowser) {
                // 監聽窗口大小變動事件
                window.addEventListener('resize', SystemController._instance.onWindowResize.bind(SystemController._instance));

                (window as any).window.onerror = function (message, source, lineno, colno, error) {
                    let exception: any = {};
                    exception.message = message;
                    exception.source = source;
                    exception.lineno = lineno;
                    exception.colno = colno;
                    exception.error = error ? error.stack : null; // 如果有 error 物件，則記錄其堆疊訊息
                    Progarm.error(JSON.stringify(exception));
                };
                window.addEventListener('unhandledrejection', function (event) {
                    let errorDetails: {
                        type: string;
                        timestamp: string;
                        reason: any;
                        message: string;
                        stack: string;
                        fileName: string;
                        lineNumber: string;
                        columnNumber: string;
                        name?: string;  // 添加可選的 name 屬性
                        currentURL: string;
                        userAgent: string;
                        localTime: string;
                        [key: string]: any;  // 允許添加其他屬性
                    } = {
                        type: 'Unhandled Promise Rejection',
                        timestamp: new Date().toISOString(),
                        reason: event.reason,
                        message: '無錯誤訊息',
                        stack: '無堆疊追蹤',
                        fileName: '未知檔案',
                        lineNumber: '未知行號',
                        columnNumber: '未知列號',
                        currentURL: window.location.href,
                        userAgent: navigator.userAgent,
                        localTime: new Date().toString()
                    };

                    // 如果 reason 是一個 Error 物件
                    interface ExtendedError extends Error {
                        fileName?: string;
                        lineNumber?: number;
                        columnNumber?: number;
                    }

                    if (event.reason instanceof Error) {
                        const extendedReason = event.reason as ExtendedError;
                        errorDetails.name = extendedReason.name;
                        errorDetails.message = extendedReason.message || errorDetails.message;
                        errorDetails.stack = extendedReason.stack || errorDetails.stack;
                        errorDetails.fileName = extendedReason.fileName ?? errorDetails.fileName;
                        errorDetails.lineNumber = String(extendedReason.lineNumber) ?? errorDetails.lineNumber;
                        errorDetails.columnNumber = String(extendedReason.columnNumber) ?? errorDetails.columnNumber;
                    }

                    // 如果 reason 是一個物件，嘗試獲取更多資訊
                    if (typeof event.reason === 'object' && event.reason !== null) {
                        Object.keys(event.reason).forEach(key => {
                            if (!(key in errorDetails)) {
                                errorDetails[key] = event.reason[key];
                            }
                        });
                    }

                    // 將錯誤詳情轉換為字串
                    let errorString = JSON.stringify(errorDetails, null, 2);

                    // 使用 Progarm.error 記錄錯誤
                    Progarm.error('未處理的 Promise 拒絕:', errorString);

                    // 可以在這裡添加將錯誤資訊發送到伺服器的邏輯
                });
            }



        } catch (e) {
            if (e instanceof Error) {
                Progarm.error(e.name, e.message, e.stack);
            } else {
                Progarm.error(e.message);
            }
        }

    }



    ChangeManifest(_mitkn: string = "", _playerToken: string = "") {
        // 取得基礎URL（不含參數）
        const baseUrl = window.location.origin + window.location.pathname;

        // 建立 URL 參數陣列
        let params = [];

        // 修改條件判斷的寫法
        if (_mitkn && _mitkn !== "") {  // 先檢查是否存在
            params.push(`mitkn=${_mitkn}`);
        }
        if (_playerToken && _playerToken !== "") {
            params.push(`token=${_playerToken}`);
        }

        // 組合完整URL
        let fullUrl = baseUrl;

        if (params.length > 0) {
            fullUrl += "?" + params.join("&");
        }

        var myDynamicManifest;
        if (PREVIEW) {
            myDynamicManifest = {
                "name": "九支刀歡樂城",
                "short_name": "九支刀歡樂城",
                "start_url": fullUrl,

            }
        } else {
            myDynamicManifest = {
                "name": "九支刀歡樂城",
                "short_name": "九支刀歡樂城",
                "start_url": fullUrl,
                "display": "fullscreen",
                "icons": [{
                    "src": "images/apple-touch-icon.png",
                    "sizes": "256x256",
                    "type": "image/png"
                }]
            }
        }

        const stringManifest = JSON.stringify(myDynamicManifest);
        const blob = new Blob([stringManifest], { type: 'application/json' });
        const manifestURL = URL.createObjectURL(blob);

        // 加入時間戳來防止快取
        const timestamp = new Date().getTime();
        const manifestURLWithTimestamp = `${manifestURL}#t=${timestamp}`;

        document.querySelector('#mi-manifest')?.setAttribute('href', manifestURLWithTimestamp);

    }
    start() {



        try {
            const systemController_ = SystemController.Instance();
            const SystemResources_ = SystemResources.Instance();
            MsgDispatcher.Register("LogoutNotifyReceipt", systemController_.onGameMessageClubTableInfoReceipt.bind(systemController_));

            director.on(Director.EVENT_AFTER_SCENE_LAUNCH, function () {


                var currentScene = director.getScene();
                var sceneName = currentScene.name;
                Progarm.log('新場景已啟動，場景名稱為:' + sceneName);


                // 確保場景名稱存在於 SceneGameName 枚舉中
                if (currentScene && sceneName in SceneGameName) {
                    const controller_ = Game_WebSocketController.Instance(Game_WebSocketController);
                    game.off(Game.EVENT_HIDE, systemController_.GameHideCallback, systemController_);
                    game.off(Game.EVENT_SHOW, systemController_.GameShowCallback, systemController_);
                    game.off(Game.EVENT_HIDE, systemController_.LobbyHideCallback, systemController_);
                    game.off(Game.EVENT_SHOW, systemController_.LobbyShowCallback, systemController_);
                    game.on(Game.EVENT_HIDE, systemController_.GameHideCallback, systemController_);
                    game.on(Game.EVENT_SHOW, systemController_.GameShowCallback, systemController_);

                    if (AudioMgr.Instance(AudioMgr).ShortAudio) {
                        SystemResources_.ChatAudio.forEach(element => {
                            AudioMgr.Instance(AudioMgr).ShortAudio.push(element);
                        });
                    }

                    {
                        const sharedJoinObject = SystemResources_.SharedPrefab.find(prefab => prefab.data.name === '聊天');

                        if (sharedJoinObject) {
                            // 聊天
                            const node = instantiate(sharedJoinObject);
                            node.parent = currentScene;
                        }


                    }
                    {
                        const playerListObject = SystemResources_.SharedPrefab.find(prefab => prefab.data.name === '玩家列表');

                        if (playerListObject) {
                            // 玩家列表
                            const node = instantiate(playerListObject);
                            node.parent = currentScene;
                        }


                    }

                } else {

                    //Progarm.log("當前場景名稱不匹配任何已定義的 SceneGameName 枚舉鍵");
                    game.off(Game.EVENT_HIDE, systemController_.GameHideCallback, systemController_);
                    game.off(Game.EVENT_SHOW, systemController_.GameShowCallback, systemController_);
                    game.off(Game.EVENT_HIDE, systemController_.LobbyHideCallback, systemController_);
                    game.off(Game.EVENT_SHOW, systemController_.LobbyShowCallback, systemController_);

                    game.on(Game.EVENT_HIDE, systemController_.LobbyHideCallback, systemController_);
                    game.on(Game.EVENT_SHOW, systemController_.LobbyShowCallback, systemController_);

                    {
                        const otherGameObject = SystemResources_.LobbyPrefab.find(prefab => prefab.data.name === 'OtherGameManager');

                        if (otherGameObject) {
                            const otherGameMsgName = otherGameObject.data.name; // 獲取 Prefab 的名稱
                            const existingNode = currentScene.getChildByName(otherGameMsgName); // 在當前場景中尋找是否已有該名稱的節點
                            if (!existingNode) { // 如果節點不存在，則創建並添加到場景中
                                const node = instantiate(otherGameObject);
                                node.parent = currentScene;
                            } else {
                                Progarm.log("OtherGameManager節點已存在於場景中,不再創建新節點。");
                            }
                        }
                    }
                }
                {
                    const shareObject = SystemResources_.SharedPrefab.find(prefab => prefab.data.name === '分享加入');

                    if (shareObject) {
                        // 分享
                        const shareNode = instantiate(shareObject);
                        shareNode.parent = currentScene;
                    }


                }
                //訊息
                {
                    const systemMsgObject = SystemResources_.SharedPrefab.find(prefab => prefab.data.name === '系統訊息');

                    if (systemMsgObject) {
                        // 假設 systemController_.SystemMsg_ 是一個 Prefab，且我們使用節點名稱來檢查是否存在
                        const systemMsgName = systemMsgObject.data.name; // 獲取 Prefab 的名稱
                        const existingNode = currentScene.getChildByName(systemMsgName); // 在當前場景中尋找是否已有該名稱的節點
                        if (!existingNode) { // 如果節點不存在，則創建並添加到場景中
                            const node = instantiate(systemMsgObject);
                            node.parent = currentScene;
                        } else {
                            Progarm.log("系統消息節點已存在於場景中，不再創建新節點。");
                        }
                    }

                }
            });
        } catch (e) {
            if (e instanceof Error) {
                Progarm.error(e.name, e.message, e.stack);
            } else {
                Progarm.error(e.message);
            }
        }

        let dispatch_event = true;
        window.addEventListener("orientationchange", (event: any) => {

            if (dispatch_event) {

                setTimeout(() => {

                    let event = document.createEvent("HTMLEvents")

                    event.initEvent("orientationchange", true, true)

                    window.dispatchEvent(event)

                    dispatch_event = true

                }, 500)

                dispatch_event = false

            }

        });






    }
    //定时调用清除日志
    clear_console() {
        console.clear();
    }



    onWindowResize() {
        // setTimeout(function () {


        // }, 2000);
    }
    updateCanvasSize() {
        let winsize = screen.windowSize;
        // let ratio = winsize.width / winsize.height;
        // let drs = view.getDesignResolutionSize();
        // let drsRatio = drs.width / drs.height;
        // if (ratio > drsRatio) {
        //     view.setResolutionPolicy(ResolutionPolicy.FIXED_HEIGHT);
        // } else {
        //     view.setResolutionPolicy(ResolutionPolicy.FIXED_WIDTH);
        // }

    }
    async checkMaintenanceStatus() {
        const systemController_ = SystemController.Instance();
        if (systemController_.IP != MiIP.MiIP_9nf) {
            //return null;
        }
        const url = 'https://www.9pkpoker.com/login/maintenance.php';

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data)
            if (data.code === 0) {
                if (data.data.status == 1 && SystemMsg.Instance()) {
                    if (data.data.msg != null && data.data.msg != undefined) {
                        SystemMsg.Instance().ShowMaintenance("現在是遊戲維護時間," + data.data.msg);
                    } else {
                        SystemMsg.Instance().ShowMaintenance("現在是遊戲維護時間");
                    }

                }
                return data.data.status; // 返回維護狀態
            } else {


                return null;
            }
        } catch (error) {
            Progarm.error("無法獲取維護狀態:", error);
            return null;
        }
    }
    GameHideCallback() {
        Progarm.log("程序進入背景")
        game.pause();
        const systemController_ = SystemController.Instance();
        systemController_.isInBackground = true;
        Game_WebSocketController.Instance(Game_WebSocketController).channel().close();
    }
    GameShowCallback() {
        Progarm.log("程序進入前景");
        MsgDispatcher.Send("GameResume", "");
        game.resume()
        const systemController_ = SystemController.Instance();
        systemController_.isInBackground = false;
        let connectInfo = systemController_.ReConnectToServer();
    }
    LobbyHideCallback() {
        Progarm.log("程序進入背景")
        game.pause();
        const systemController_ = SystemController.Instance();
        systemController_.isInBackground = true;
        Game_WebSocketController.Instance(Game_WebSocketController).channel().close();
    }
    async LobbyShowCallback() {
        Progarm.log("程序進入前景");
        MsgDispatcher.Send("GameResume", "");
        game.resume()
        const systemController_ = SystemController.Instance();
        systemController_.isInBackground = false;


        Game_WebSocketController.Instance(Game_WebSocketController).CheckLobbyConnect();
    }
    public update(dt): void {
        const systemController_ = SystemController.Instance();
        systemController_.curTime += dt;
        systemController_.curFrame++;
        for (let i = 0; i < systemController_.funList.length; i++) {
            let fun = systemController_.funList[i];
            // 如果是targetFrame 需要与curFrame比较
            if (fun.targetFrame > systemController_.curTime) {
                continue;
            }
            systemController_.funList.splice(i, 1)[0].callback();
            i--;
        }
    }

    public AddNextFrame(frame: number, callback: () => void): void {
        const systemController_ = SystemController.Instance();

        let targetTime = systemController_.curTime + frame;
        systemController_.funList.push({ targetFrame: targetTime, callback: callback });
    }
    async ReConnectToServer() {
        try {
            if (!globalThis.isconnect) {
                return null;
            }
            Progarm.log(" systemController_.ReConnectToServer");
            const controller_ = Game_WebSocketController.Instance(Game_WebSocketController);
            let connectInfo = await controller_.ReConnectToServer();
            if (connectInfo == null) {
                SystemMsg.Instance().Show("連線中斷，請重新連線。", 1);

                return null;
            } else if (connectInfo == false) {
                return null;
            }
            SystemMsg.Instance().ShowLoading(false, "-1");
            MsgDispatcher.Send("ReEnterGame", "");


        } catch (e) {
            SystemMsg.Instance().ShowLoading(false, "-1");
            if (e instanceof Error) {
                Progarm.error(e.name, e.message, e.stack);
            } else {
                Progarm.error(e.message);
            }
        }



    }

    btn1() {

    }
    async GetLobbyInfo() {
        try {
            const systemController_ = SystemController.Instance();
            var currentScene = director.getScene();
            var sceneName = currentScene.name;

            let isReGameLogin: boolean = false;
            if ((PREVIEW || !sys.isNative) && systemController_.DevGame != DevSceneGameName.Null) {
                // 開發模式直接進入遊戲
            } else {
                if (currentScene && sceneName in SceneGameName) {
                    // this.LoadScene(sceneName);
                    // return;
                    // isReGameLogin = true;
                } else if (sceneName == "Lobby") {
                    //如果已經在大廳
                    await Game_WebSocketController.Instance(Game_WebSocketController).CheckLobbyConnect();
                    return;
                } else {
                    if (sceneName == "Loading") {
                        let resp = await Game_WebSocketController.Instance(Game_WebSocketController).CheckLobbyConnect();
                        if (!resp) {
                            return false;
                        }
                    }
                  


                    // return true;
                }

            }
            let LobbyInfoRequest_ = new richcli.GameLobbyProtocol.LobbyInfoRequest();
            LobbyInfoRequest_.PlayerToken = globalThis.PlayerToken;
            // sys.localStorage.removeItem("ReJoinGame");
            // sys.localStorage.removeItem("roomtoken");
            let LobbyInfo_ = await Game_WebSocketController.Instance(Game_WebSocketController).SendRequestConfirm('gamelobby.LobbyInfo', LobbyInfoRequest_);
            systemController_.LobbyInfoResponse = new richcli.GameLobbyProtocol.LobbyInfoResponse(LobbyInfo_);
            Logger.logLevel = systemController_.LobbyInfoResponse.DebugLevel
            Progarm.log("LobbyInfoResponse", JSON.stringify(systemController_.LobbyInfoResponse));
            // globalThis.NickName = response_.NickName;
            globalThis.PlayerId = systemController_.LobbyInfoResponse.PlayerId.toString();
            globalThis.MemberId = systemController_.LobbyInfoResponse.MemberId.toString();

            if (sceneName == "Lobby") {
                //通知大廳更新
                MsgDispatcher.Send("ReEnterLobby", systemController_.LobbyInfoResponse, "Main");
            }
            if (systemController_.DevGame != DevSceneGameName.Null) {
                const serverGameName = mapSceneToServer(systemController_.DevGame);
                const sceneGame = mapDevToSceneGameName(systemController_.DevGame);
                SystemController._instance.MateGame("Phoenix", "Phoenix");
            }
        } catch (e) {
            if (e instanceof Error) {
                Progarm.error(e.name, e.message, e.stack);
            } else {
                Progarm.error(e.message);
            }
        }

    }

    async MateGame(gameName: string, sceneName: string) {
        try {
            if (!globalThis.isGameAccessDenied) {
                SystemMsg.Instance().Show("遊戲進行中、請稍後");
                return;
            }
            if (SystemController._instance.isMateGame) return;
            SystemController._instance.isMateGame = true;
            let CliMateGameRequest_ = new richcli.GameLobbyProtocol.CliMateGameRequest();
            CliMateGameRequest_.gamename = gameName;
            CliMateGameRequest_.paramindex = 0;
            CliMateGameRequest_.tabletype = 0;

            try {
                let response_ = await Game_WebSocketController.Instance(Game_WebSocketController).SendRequestConfirm('gamelobby.CliMateGame', CliMateGameRequest_);
                response_ = new richcli.GameLobbyProtocol.CliMateGameResponse(response_);
                switch (response_.state) {
                    case 1:
                        sys.localStorage.setItem('ReJoinGame', globalThis.ClubId);
                        sys.localStorage.setItem('roomtoken', response_.Roomtoken);
                        sys.localStorage.setItem('RoomKey', response_.RoomKey);
                        globalThis.LobbyClubStep = "0";
                        globalThis.NowGameName = gameName;
                        globalThis.Roomtoken = response_.Roomtoken;
                        globalThis.RoomKey = response_.RoomKey;
                        globalThis.gameSrvName = response_.srvname;
                        tokon.getInstance().roomTokon = response_.Roomtoken;

                        SystemController._instance.LoadScene(sceneName);

                        break;
                    case 2:
                        SystemMsg.Instance().Show("餘額不足");

                        break;
                    case 6:
                        SystemMsg.Instance().Show("版主不能進行遊戲");

                        break;
                    case 7:
                        SystemMsg.Instance().Show("現在是遊戲維護時間 " + response_.MaintenanceInfo);

                        break;
                    case 8:
                        SystemMsg.Instance().Show("遊戲桌準備移除,無法進入");

                        break;
                    case 9:
                        SystemMsg.Instance().Show("點數已超過封頂值，無法進入遊戲");

                        break;
                    case 10:
                        SystemMsg.Instance().Show("已被禁止遊戲 請聯絡上級");

                        break;
                    default:

                        SystemMsg.Instance().Show("入局失敗，錯誤代碼:" + response_.state);

                        break;

                }
                SystemMsg.Instance().ShowLoading(false, "-1");
                SystemController._instance.isMateGame = false;

                Progarm.log("CliMateGameResponse", JSON.stringify(response_));
                Progarm.log("tokon.getInstance()", tokon.getInstance().roomTokon);
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

    LoadScene(name: string) {
        director.loadScene(name);
        // director.preloadScene(name,()=>{
        // });
    }
    AddpreloadScene(GameId, sceneName: string) {
        let GameData = new GameState();
        GameData.GameId = GameId;
        GameData.state = 0;
        director.preloadScene(sceneName, (completedCount, totalCount, item) => {
            let progress = completedCount / totalCount;
            GameData.state = 1;
            GameData.progress = progress * 100;
            //log(`加載進度: ${progress * 100}%`);
        }, (errorf, asset) => {
            if (errorf) {
                error('加載場景失敗:', errorf);
            } else {
                Progarm.log('場景加載完成' + sceneName);
                GameData.state = 2

            }
        });

    }
    onGameMessageClubTableInfoReceipt(magType: string, msgContent: any) {
        let LogoutNotifyReceipt_ = new richcli.GameLobbyProtocol.LogoutNotifyReceipt(msgContent);
        const controller = Game_WebSocketController.Instance(Game_WebSocketController);
        SystemMsg.Instance().Show(LogoutNotifyReceipt_.Info, 2);
        globalThis.isconnect = false;
        globalThis.ReLogin = "close";
        controller.channel().close();
    }

}