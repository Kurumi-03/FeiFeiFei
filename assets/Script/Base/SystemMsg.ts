import {
  _decorator,
  Component,
  director,
  Label,
  Node,
  ProgressBar,
  RichText,
  Sprite,
  sys,
} from "cc";
import { Progarm } from "./Progarm";
import { TimerManager } from "../Lobby/TimerManager";
import { SystemResources } from "./SystemResources";
import { mapServerNumToSceneGameNameDirect } from "./GameName";
const { ccclass, property } = _decorator;

@ccclass("SystemMsg")
export class SystemMsg extends Component {
  @property(Node)
  main: Node = null;
  @property(Node)
  maintenance: Node = null;
  @property(Node)
  mainShort: Node = null;
  @property(Node)
  mainShortBlock: Node = null;
  @property(Node)
  mainloading: Node = null;
  @property(RichText)
  txt: RichText = null;
  @property(RichText)
  txtMaintenance: RichText = null;
  @property(Label)
  txtShort: Label = null;
  @property(Node)
  loadingContentForGameImgs: Node = null;
  @property(Sprite)
  loadingSpriteForGameImgs: Sprite = null;
  @property(Label)
  loadingTextForGameImgs: Label = null;
  @property(ProgressBar)
  progressBarForGameImgs: ProgressBar = null;
  @property(Node)
  mask: Node = null;
  tmpType: number;
  mOkFunc?: Function = null;
  dot: number = 0;
  dotTxt: string = "";
  ShortMsgTimeID: string = "";
  ShortMsgLoadTimeID: string = "";
  ShortMsgPanelTimeID: string = "";
  private timerManager;
  private static _instance = null;
  public static Instance(): SystemMsg {
    if (this._instance == null) {
    }
    return this._instance;
  }

  onLoad() {
    SystemMsg._instance = this;
    SystemMsg._instance.timerManager = TimerManager.Instance();
    SystemMsg._instance.Close();
    SystemMsg._instance.maintenance.active = false;
  }
  start() { }

  update(deltaTime: number) { }
  Show(msg: string, type: number = 0) {
    SystemMsg._instance.main.active = true;
    SystemMsg._instance.txt.string = msg;
    SystemMsg._instance.tmpType = type;
    if (type == 4) {
      SystemMsg._instance.scheduleOnce(() => {
       
        Progarm.openWebsite('https://www.9pkpoker.com/')
      }, 5)
    }

  }
  ShowMaintenance(msg: string) {
    SystemMsg._instance.maintenance.active = true;
    SystemMsg._instance.txtMaintenance.string = msg;


  }
  Show2(msg: string, okFunc?: Function, type: number = 1) {
    SystemMsg._instance.main.active = true;
    SystemMsg._instance.txt.string = msg;
    SystemMsg._instance.mOkFunc = okFunc;
    SystemMsg._instance.tmpType = type;

  }

  ShortMsg(msg: string, t: number = 2, type: number = 0) {
    if (!SystemMsg._instance.mainShort) return;

    try {
      SystemMsg._instance.mainShortBlock.active = false;
      SystemMsg._instance.mainShort.active = true;
      SystemMsg._instance.txtShort.string = msg;
      SystemMsg._instance.timerManager.unscheduleSelf(SystemMsg._instance.ShortMsgPanelTimeID);
      SystemMsg._instance.timerManager.unscheduleSelf(SystemMsg._instance.ShortMsgTimeID);
      if (type == 1) {
        SystemMsg._instance.dotTxt = msg;
        SystemMsg._instance.ShortMsgTimeID = SystemMsg._instance.timerManager.scheduleSelf(() => {
          SystemMsg._instance.dot++;
          let str = "";
          for (let i = 0; i < SystemMsg._instance.dot; i++) {
            str += ".";
          }

          SystemMsg._instance.txtShort.string = SystemMsg._instance.dotTxt + str;
          if (SystemMsg._instance.dot >= 3) {
            SystemMsg._instance.dot = 0;
          }
        }, 0.5);
      } else if (type == 2) {
        SystemMsg._instance.mainShortBlock.active = true;
        SystemMsg._instance.dotTxt = msg;
        SystemMsg._instance.ShortMsgTimeID = SystemMsg._instance.timerManager.scheduleSelf(() => {
          SystemMsg._instance.dot++;
          let str = "";
          for (let i = 0; i < SystemMsg._instance.dot; i++) {
            str += ".";
          }

          SystemMsg._instance.txtShort.string = SystemMsg._instance.dotTxt + str;
          if (SystemMsg._instance.dot >= 3) {
            SystemMsg._instance.dot = 0;
          }
        }, 0.5);
      }
      SystemMsg._instance.ShortMsgPanelTimeID = SystemMsg._instance.timerManager.scheduleSelf(() => {
        if (SystemMsg._instance.mainShort) {
          SystemMsg._instance.mainShort.active = false;
        }
      }, t);
    } catch (e) {

      SystemMsg._instance.timerManager.unscheduleSelf(SystemMsg._instance.ShortMsgTimeID);
    }
  }
  ShowLoading(t1: boolean = true, type: string = "0") {
    try {
      const systemResources = SystemResources.Instance();
      switch (type) {
        case "-1":

          SystemMsg._instance.mask.active = t1;

          break;
        case "0":
          if (!SystemMsg._instance.mainloading) return;
          SystemMsg._instance.mainloading.active = t1;
          break;
        case "-2":
          SystemMsg._instance.loadingContentForGameImgs.active = t1;
          SystemMsg._instance.timerManager.unscheduleSelf(SystemMsg._instance.ShortMsgLoadTimeID);
          break;
        default:
          systemResources.LobbySpriteFrame.forEach(element => {

            let parts = element.name.split('_');
            if (parts.length == 4 && parts[3] == type) {
              SystemMsg._instance.loadingContentForGameImgs.active = t1;
              SystemMsg._instance.loadingSpriteForGameImgs.spriteFrame = element;
            }

          });
          SystemMsg._instance.timerManager.unscheduleSelf(SystemMsg._instance.ShortMsgLoadTimeID);
          if (t1) {
            let num: number = 0;
            SystemMsg._instance.ShortMsgLoadTimeID = SystemMsg._instance.timerManager.scheduleSelf(() => {
              num += 5;
              SystemMsg._instance.progressBarForGameImgs.progress = num / 100;
              SystemMsg._instance.loadingTextForGameImgs.string = num > 96 ? "95%" : num + "%";
            }, 0.1, 19);
          }

          break;

      }

    } catch (e) {

    }
  }

  ShortMsgClose() {
    SystemMsg._instance.mainShort.active = false;
    SystemMsg._instance.timerManager.unscheduleSelf(SystemMsg._instance.ShortMsgTimeID);
    SystemMsg._instance.timerManager.unscheduleSelf(SystemMsg._instance.ShortMsgLoadTimeID);
    SystemMsg._instance.timerManager.unscheduleSelf(SystemMsg._instance.ShortMsgPanelTimeID);
  }
  Close(showLevel: number = 1) {
    if (SystemMsg._instance.mOkFunc != null) {
      SystemMsg._instance.mOkFunc();
      SystemMsg._instance.mOkFunc = null;
    } else if (SystemMsg._instance.tmpType == 1) {
      director.loadScene("Loading");
    } else if (SystemMsg._instance.tmpType == 2) {
      if (!sys.isBrowser) {
        director.loadScene("Loading");
      } else {
        window.location.reload();
      }
    } else if (SystemMsg._instance.tmpType == 3) {
      Progarm.preloadScene("Lobby");
    } else if (SystemMsg._instance.tmpType == 4) {


    }
    SystemMsg._instance.main.active = false;
  }
  CloseWindows() {
    window.open("https://www.9pkpoker.com/?page=3", "_self")
    window.close();
  }
  CloseAll() {
    SystemMsg._instance.mainShort.active = false;
    SystemMsg._instance.timerManager.unscheduleSelf(SystemMsg._instance.ShortMsgTimeID);
    SystemMsg._instance.timerManager.unscheduleSelf(SystemMsg._instance.ShortMsgLoadTimeID);
    SystemMsg._instance.timerManager.unscheduleSelf(SystemMsg._instance.ShortMsgPanelTimeID);
    SystemMsg._instance.main.active = false;
    SystemMsg._instance.maintenance.active = false;
  }
  protected onDestroy(): void {
    SystemMsg._instance.timerManager.unscheduleSelf(SystemMsg._instance.ShortMsgLoadTimeID);
    SystemMsg._instance.timerManager.unscheduleSelf(SystemMsg._instance.ShortMsgTimeID);
    SystemMsg._instance.timerManager.unscheduleSelf(SystemMsg._instance.ShortMsgPanelTimeID);
  }
}
