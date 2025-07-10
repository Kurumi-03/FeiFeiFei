import { _decorator, Component, log, native, Node, RichText, sys } from 'cc';
import richcli from "../../proto/richsrv-cli.js";
import Game_WebSocketController from '../Base/Game_WebSocketController';
import { PREVIEW } from 'cc/env';
import { SystemMsg } from '../Base/SystemMsg';
import { Progarm } from '../Base/Progarm';
import { NetworkManager } from '../Base/NetworkManager';
import { SystemController } from '../Base/SystemController';

const { ccclass, property } = _decorator;

@ccclass('LoadingManager')
export class LoadingManager extends Component {
    private static _instance: LoadingManager = null;
    CallGOAppleStore: Function;
    public static Instance() {

        if (this._instance == null) {

        }
        return this._instance;
    }
    onLoad() {
        LoadingManager._instance = this;
        const game_WebSocketController_ = Game_WebSocketController.Instance(Game_WebSocketController);
        const systemController_ = SystemController.Instance();
        globalThis.xcoedGetLineLogin = true;

        if (sys.os == sys.OS.ANDROID) {
        }
        else if (sys.os == sys.OS.IOS) {

          
        }


        (window as any).receiveValueFromSwift = function (value: string) {

            if (!globalThis.xcoedGetLineLogin) {

                let arr = value.split(",");
                if (arr.length == 3) {

                    game_WebSocketController_.PlatformData(globalThis.PlayerToken, arr[0], arr[1], arr[2])

                    globalThis.xcoedGetLineLogin = true;
                }

            }

            // 取得line登入
        };

        globalThis.LobbyClubStep = "";

        game_WebSocketController_.Register_onClose(LoadingManager._instance.onGameSrvDisconnect);

      





    }
    start() {

    }

    update(deltaTime: number) {

    }
    CheckLogin = async (token,loading_txt: Node, StepFun: Function) => {
        try {
            const systemController_ = SystemController.Instance();
            const game_WebSocketController_ = Game_WebSocketController.Instance(Game_WebSocketController);
            let value = null;
            let LoginMode = sys.localStorage.getItem('LoginMode');
            if (LoginMode) {

            } else {
                LoginMode = "default";
            }

            switch (LoginMode) {
                case "default":
                    if (!globalThis.isRe) {
                        if (sys.isBrowser) {
                            let params = new URLSearchParams(location.search);

                            if (params.get("token")) {
                                
                                value = params.get("token");
                                
                            } else if (params.get("mitkn")) {
                                const newMitkn = params.get("mitkn");
                                value = sys.localStorage.getItem('PlayerToken');

                                await LoadingManager._instance.MitknLogin(newMitkn, loading_txt, value);

                                return
                            } else {
                                value = sys.localStorage.getItem('PlayerToken');

                                
                            }

                        } else {
                            value = sys.localStorage.getItem('PlayerToken');
                            
                        }


                    }
                    break;
                case "Line":
                 
                    break;
            }
            console.log("CheckLogin66666");

            if (PREVIEW || !sys.isNative) {
                if (value==null&&globalThis.testAccToken != "") {
                    value = globalThis.testAccToken;
                }

            }
            if(token!="")
            {
                value = token;
            }
            else
            {
                value = globalThis.testAccToken;
            }
            
            console.log("CheckLogin777: ",value);
            if (value) {// have PlayerToken

                loading_txt.getComponent(RichText).string = "努力登入中...99% ";
                let connectInfo = await game_WebSocketController_.ReConnectToServer();
                if (connectInfo == null) {
                    SystemMsg.Instance().Show("連線中斷，請重新連線。", 1);
                    return null;
                } else if (connectInfo == false) {
                    return null;
                }
                game_WebSocketController_.VerifyPlayerToken(value, 0, loading_txt);

            }
            else {
                StepFun(false);

            }
        } catch (e) {
            if (e instanceof Error) {
                Progarm.error("onMessage error", e.name, e.message, e.stack);
            } else {
                Progarm.error("onMessage error", e.message);
            }
        }


    }
    async MitknLogin(_Mitkn, loading_txt, playerToken = "") {
        try {
            const systemController_ = SystemController.Instance();
            const game_WebSocketController_ = Game_WebSocketController.Instance(Game_WebSocketController);

            let connectInfo = await game_WebSocketController_.ReConnectToServer();
            if (connectInfo == null) {
                SystemMsg.Instance().ShortMsgClose();
                SystemMsg.Instance().Show("連線中斷，請重新連線。", 1);
                return null;
            } else if (connectInfo == false) {
                SystemMsg.Instance().ShortMsgClose();
                return null;
            }
            let PlayerLoginRequest_ = new richcli.GameLobbyProtocol.PlayerLoginRequest();
            PlayerLoginRequest_.Version = systemController_.VersionNumber;
            PlayerLoginRequest_.Account = _Mitkn
            PlayerLoginRequest_.LoginType = 2;
            PlayerLoginRequest_.PlayerToken = playerToken
            Progarm.log(PlayerLoginRequest_);
            let PlayerLoginResponse_ = await game_WebSocketController_.channel().sendRequest('gamelobby.PlayerLogin', PlayerLoginRequest_);
            let response_ = new richcli.GameLobbyProtocol.PlayerLoginResponse(PlayerLoginResponse_);

            Progarm.log("GameLobby.PlayerLogin", response_);
            if (response_.State == 1) {

                sys.localStorage.setItem('LoginMode', "default");
                globalThis.PlayerToken = response_.PlayerToken;
                loading_txt.getComponent(RichText).string = "努力登入中...99% ";


                game_WebSocketController_.VerifyPlayerToken(response_.PlayerToken, 0, loading_txt);


            } else if (response_.State == 3) {
                SystemMsg.Instance().ShortMsgClose();
                SystemMsg.Instance().Show2("版本不符,請更新遊戲");

                globalThis.isconnect = false;
                globalThis.ReLogin = "close";
                game_WebSocketController_.channel().close();
            } else if (response_.State == 5) {
                SystemMsg.Instance().ShortMsgClose();
                SystemMsg.Instance().ShowMaintenance("「系統維護中……」");
                globalThis.isconnect = false;
                globalThis.ReLogin = "close";
                game_WebSocketController_.channel().close();
            } else {
                SystemMsg.Instance().ShortMsgClose();
                try {
                    globalThis.ReLogin = "close";
                    game_WebSocketController_.channel().close();

                } catch (e) {


                }
                let VersionNumber_ = systemController_.VersionNumber;
                let arr = VersionNumber_.split(".");
                if (arr.length == 3) {
                    if (arr[0] == "0" && arr[1] == "0" && Number(arr[2]) < 60) {
                        sys.localStorage.clear();
                    } else if (PREVIEW || !sys.isNative) {
                        sys.localStorage.clear();
                    }
                }
                SystemMsg.Instance().Show("登入失敗", 2);

                globalThis.isconnect = false;
            }
        } catch (e) {
            if (e instanceof Error) {
                Progarm.error("onMessage error", e.name, e.message, e.stack);
            } else {
                Progarm.error("onMessage error", e.message);
            }
        }

    }
    async GuestLogin(guestLoginSetp: Function) {
        try {
            {
                let isGuest: boolean = false;
                if (!NetworkManager.Instance().checkInitialNetworkStatus()) {
                    SystemMsg.Instance().Show("請確認您的網路是否開啟", 1);
                    return;
                }

                const systemController_ = SystemController.Instance();
                const game_WebSocketController_ = Game_WebSocketController.Instance(Game_WebSocketController);

                let value;
                let response_;


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
                if (PREVIEW || !sys.isNative) {
                    if (globalThis.testAccToken != "") {
                        value = globalThis.testAccToken;
                    }

                }

                if (value) {// have PlayerToken
                    SystemMsg.Instance().ShortMsg("努力登入中", 99999, 2);
                    let connectInfo = await game_WebSocketController_.ReConnectToServer();
                    if (connectInfo == null) {
                        SystemMsg.Instance().ShortMsgClose();
                        SystemMsg.Instance().Show("連線中斷，請重新連線。", 1);
                        return null;
                    } else if (connectInfo == false) {
                        SystemMsg.Instance().ShortMsgClose();
                        return null;
                    }
                    await game_WebSocketController_.VerifyPlayerToken(value, 0);
                    SystemMsg.Instance().ShortMsgClose();
                    return;

                }
                else {
                    isGuest = true;

                }
                if (isGuest) {
                    Progarm.log("connectToServer.....", globalThis.srv_ip_port, (new Date()).toLocaleString());
                    SystemMsg.Instance().ShortMsg("我們正在為您創建帳號，請稍等片刻", 99999, 2);



                    let connectInfo = await game_WebSocketController_.ReConnectToServer();
                    if (connectInfo == null) {
                        SystemMsg.Instance().ShortMsgClose();
                        SystemMsg.Instance().Show("連線中斷，請重新連線。", 1);
                        return null;
                    } else if (connectInfo == false) {
                        SystemMsg.Instance().ShortMsgClose();
                        return null;
                    }
                    let PlayerLoginRequest_ = new richcli.GameLobbyProtocol.PlayerLoginRequest();
                    PlayerLoginRequest_.Version = systemController_.VersionNumber;
                    PlayerLoginRequest_.LoginType = 0;
                    Progarm.log(PlayerLoginRequest_);
                    let PlayerLoginResponse_ = await game_WebSocketController_.channel().sendRequest('gamelobby.PlayerLogin', PlayerLoginRequest_);
                    response_ = new richcli.GameLobbyProtocol.PlayerLoginResponse(PlayerLoginResponse_);

                    Progarm.log("GameLobby.PlayerLogin", response_);
                    if (response_.State == 1) {
                        sys.localStorage.setItem('PlayerToken', response_.PlayerToken);
                        sys.localStorage.setItem('LoginMode', "default");
                        globalThis.PlayerToken = response_.PlayerToken;
                        SystemMsg.Instance().ShortMsg("正在連接到大廳，感謝您的耐心等待...", 99999, 2);
                        game_WebSocketController_.VerifyPlayerToken(response_.PlayerToken, 0);
                        return;
                        // let resp = await systemController_.GetLobbyInfo();


                        // if (!resp) {
                        //     SystemMsg.Instance().Show("無法連接到大廳，請聯繫客服。");
                        // }
                    } else if (response_.State == 3) {
                        SystemMsg.Instance().ShortMsgClose();
                        SystemMsg.Instance().Show2("版本不符,請更新遊戲", guestLoginSetp(5), 0);

                        globalThis.isconnect = false;
                        globalThis.ReLogin = "close";
                        game_WebSocketController_.channel().close();
                    } else if (response_.State == 5) {
                        SystemMsg.Instance().ShortMsgClose();
                        SystemMsg.Instance().ShowMaintenance("「系統維護中……」");
                        globalThis.isconnect = false;
                        globalThis.ReLogin = "close";
                        game_WebSocketController_.channel().close();
                    } else {
                        SystemMsg.Instance().ShortMsgClose();
                        try {
                            globalThis.ReLogin = "close";
                            game_WebSocketController_.channel().close();

                        } catch (e) {


                        }
                        let VersionNumber_ = systemController_.VersionNumber;
                        let arr = VersionNumber_.split(".");
                        if (arr.length == 3) {
                            if (arr[0] == "0" && arr[1] == "0" && Number(arr[2]) < 60) {
                                sys.localStorage.clear();
                            } else if (PREVIEW || !sys.isNative) {
                                sys.localStorage.clear();
                            }
                        }
                        SystemMsg.Instance().Show("登入失敗", 2);

                        globalThis.isconnect = false;
                    }


                }


                SystemMsg.Instance().ShortMsgClose();
                SystemMsg.Instance().ShowLoading(false);


            }
        } catch (e) {
            Progarm.error(e);
            if (e instanceof Error) {
                Progarm.error("onMessage error", e.name, e.message, e.stack);
            } else {
                Progarm.error("onMessage error", e.message);
            }
        }



    }
  

    // 遊戲服務器斷開
    onGameSrvDisconnect = () => {

        try {
            if (globalThis.ReLogin != "close") {
                try {
                    Game_WebSocketController.Instance(Game_WebSocketController).channel().close();

                } catch (e) {


                }

            } else {
                globalThis.ReLogin = "";
            }


        }
        catch (e) {
            Progarm.log("onGameSrvDisconnect:" + e.message);

        }


    }

}

