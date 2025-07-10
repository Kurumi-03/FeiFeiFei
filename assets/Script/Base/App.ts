import { _decorator, assetManager, Component, director, Game, game, instantiate, screen, Layers, Node, Prefab, RichText, sp, sys, UIOpacity, UITransform, view, debug, log, animation } from 'cc';
import { SystemResources } from './SystemResources';
import { NetworkManager } from './NetworkManager';
import { SystemMsg } from './SystemMsg';
import { LoadingManager } from '../Loading/LoadingManager';
import MsgDispatcher from './MsgDispatcher';
import { Progarm } from './Progarm';
import { SystemController } from './SystemController';

const { ccclass, property, executionOrder } = _decorator;

@ccclass('App')
@executionOrder(1)
export class App extends Component {


    @property(Node)
    objProgressPanel: Node | null = null;

    @property(Node)
    LoadingPanelNode: Node | null = null;

    @property(Node)
    loadingMsg: Node | null = null;

    @property(RichText)
    VersionNumber_: RichText | null = null;



    private isMaintenance: boolean = false;

    onLoad() {
        console.error("App onLoad");
    }
    async start() {
        console.error("App start");
        try {

            game.off(Game.EVENT_HIDE);
            game.off(Game.EVENT_SHOW);

            globalThis.xcoedGetLineLogin = true;
            MsgDispatcher.Clear();
            Progarm.log("App onLoad");


            view.resizeWithBrowserSize(true);

            const systemResources = SystemResources.Instance();
           
            const systemController_ = SystemController.Instance();

            this.VersionNumber_.string = systemController_.VersionNumber;
            
            this.setProgress(0, 0);

            this.isMaintenance = false;
            if (globalThis.isRe == undefined) {
                globalThis.isRe = false;
                this.progressFinish();
            } else if (globalThis.isRe == true) {
                this.setProgress(0.99, 0);
                this.CallLoginPrefab(systemResources.LoginPrefab);
                this.scheduleOnce(() => {
                    MsgDispatcher.Send("OpenLoadingView", "");
                    this.objProgressPanel.active = false;
                    globalThis.isRe = false;
                }, 1);
            } else {
                this.progressFinish();
            }
        } catch (e) {
            if (e instanceof Error) {
                Progarm.error(e.name, e.message, e.stack);
            } else {
                Progarm.error(e.message);
            }
        }

    }

    update(deltaTime: number) { }

    progressFinish() {
        // if (!NetworkManager.Instance().checkInitialNetworkStatus()) {
        //     SystemMsg.Instance().Show("請確認您的網路是否開啟", 1);
        //     return;
        // }
        console.log("progressFinish");
        SystemResources.Instance().LoadProgress(this.setProgress, this.CheckLogin, this.CallLoginPrefab, this.CallMsgPanel);
    }

    loginUser533()
    {
        LoadingManager.Instance().CheckLogin("a4cccc5c-bdbb-43f4-ae9d-30e9077d2787",this.loadingMsg, this.StepFun);
    }


    loginUser534()
    {
        
        LoadingManager.Instance().CheckLogin("a4cccc5c-bdbb-43f4-ae9d-30e9077d2787",this.loadingMsg, this.StepFun);
    }

    CheckLogin = () => {
        console.log("CheckLogin");
        if (this.isMaintenance) return;
        // LoadingManager.Instance().CheckLogin(this.loadingMsg, this.StepFun);
    }

    CallLoginPrefab = (loginPrefab: Prefab) => {
        
        console.log("CallLoginPrefab ");
        try {
            let tmp = instantiate(loginPrefab);
            this.LoadingPanelNode.addChild(tmp);
        } catch (e) {
            if (e instanceof Error) {
                Progarm.error(e.name, e.message, e.stack);
            } else {
                Progarm.error(e.message);
            }
        }

    }

    CallMsgPanel = (systemMsgPrefab: Prefab) => {
        
        console.log("CallMsgPanel ");
        try {
            let tmp = instantiate(systemMsgPrefab);
            director.getScene().addChild(tmp);

        } catch (e) {
            if (e instanceof Error) {
                Progarm.error(e.name, e.message, e.stack);
            } else {
                Progarm.error(e.message);
            }
        }


    }

    StepFun = (step: boolean) => {
        
        console.log("StepFun ");
        try {
            if (!step) {
                MsgDispatcher.Send("OpenLoadingView", "");
      
                this.objProgressPanel.active = false;
            }
        } catch (e) {
            if (e instanceof Error) {
                Progarm.error(e.name, e.message, e.stack);
            } else {
                Progarm.error(e.message);
            }
        }

    }

    setProgress = (num: number, start = 0, end = 1) => {
        try {
          
        console.log("setProgress ",num);
        } catch (e) {
            if (e instanceof Error) {
                Progarm.error(e.name, e.message, e.stack);
            } else {
                Progarm.error(e.message);
            }
        }

    }

    


   
}