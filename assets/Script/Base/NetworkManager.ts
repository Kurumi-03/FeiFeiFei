import { _decorator, Component, director, error, log, native, sys } from 'cc';
import { SystemMsg } from './SystemMsg';
import MsgDispatcher from './MsgDispatcher';
import { SystemController } from './SystemController';
import Game_WebSocketController from './Game_WebSocketController';
import { Progarm } from './Progarm';
const { ccclass } = _decorator;

@ccclass('NetworkManager')
export class NetworkManager extends Component {
    private static _instance: NetworkManager | null = null;
    private _isNetworkConnected: boolean = false;

    public static Instance(): NetworkManager | null {
        return this._instance;
    }

    onLoad() {
        NetworkManager._instance = this;
        director.addPersistRootNode(NetworkManager._instance.node);
        NetworkManager._instance.setupNetworkCallback();
        (window as any).checkAndSendNetworkStatus = NetworkManager._instance.handleNetworkStatusChange.bind(NetworkManager._instance);
        NetworkManager._instance.setupNetworkListeners();
        NetworkManager._instance.schedule(NetworkManager._instance.checkAndSendNetworkStatus, 5);
        NetworkManager._instance.checkAndSendNetworkStatus();
    }

    setupNetworkListeners(): void {
        window.addEventListener('online', () => NetworkManager._instance.handleConnectionResume());
        window.addEventListener('offline', () => NetworkManager._instance.handleConnectionLost());
    }

    setupNetworkCallback(): void {
        (window as any).checkAndSendNetworkStatusCallback = NetworkManager._instance.checkAndSendNetworkStatusCallback.bind(NetworkManager._instance);
        
        NetworkManager._instance.updateNetworkStatus();
    }

    updateNetworkStatus(): void {
        if (sys.isBrowser) {
            NetworkManager._instance._isNetworkConnected = navigator.onLine;
            Progarm.log(NetworkManager._instance._isNetworkConnected ? "有網路連接" : "沒有網路連接");
        }
    }

    handleNetworkStatusChange(isConnected: string): void {
        NetworkManager._instance._isNetworkConnected = (isConnected === "true");
        NetworkManager._instance._isNetworkConnected ? NetworkManager._instance.handleConnectionResume() : NetworkManager._instance.handleConnectionLost();
    }

    simulateNetworkChange(status: string): void {
        (window as any).checkAndSendNetworkStatusCallback(status);
    }

    checkAndSendNetworkStatus(): void {
        if (sys.isBrowser) return;

        // if (sys.os === sys.OS.ANDROID) {
        //     native.reflection.callStaticMethod("com/cocos/game/AppActivity", "getCurrentNetworkStatusFromJS", "()V");
        // } else if (sys.os === sys.OS.IOS) {
        //     native.reflection.callStaticMethod("ViewController", "getCurrentNetworkStatusFromJS");
        // }
    }

    handleConnectionResume(): void {
        NetworkManager._instance._isNetworkConnected = true;
        const controller_ = Game_WebSocketController.Instance(Game_WebSocketController);
        if (controller_) {
            const channel = controller_.channel();
            if (channel && !channel.isSocketConnected()) {
                SystemMsg.Instance().CloseAll();
                const systemController_ = SystemController.Instance();
                systemController_.ReConnectToServer();
                Progarm.log("handleConnectionResume ReConnectToServer");
            }
        } else {
            error('Game_WebSocketController instance is undefined.');
        }
    }

    handleConnectionLost(): void {
        NetworkManager._instance._isNetworkConnected = false;
        SystemMsg.Instance().Show("請確認您的網路是否開啟", 1);
        const controller_ = Game_WebSocketController.Instance(Game_WebSocketController);
        if (controller_) {
            controller_.channel().close();
        }
    }

    checkAndSendNetworkStatusCallback(value: string): void {
        NetworkManager._instance._isNetworkConnected = (value === "true");
        if (!NetworkManager._instance._isNetworkConnected) {
            NetworkManager._instance.handleConnectionLost();
        }
    }

    onDestroy(): void {
        window.removeEventListener('online', () => NetworkManager._instance.handleConnectionResume());
        window.removeEventListener('offline', () => NetworkManager._instance.handleConnectionLost());
    }

    checkInitialNetworkStatus(): boolean {
        return true;
    }
}