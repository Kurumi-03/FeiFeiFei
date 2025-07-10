import { _decorator } from "cc";
import { Progarm } from "./Progarm";
import { LogLevel } from "./LogLevel";
export default class MsgDispatcher {
  private static m_registeredMsgs: { [key: string]: Array<Function> } = {};
  private static m_registeredMsgsRoot: { [key: string]: Array<Function> } = {};
  public static Register(msgName: string, onMsgReceived: Function, autodelete: boolean = false): void {
    if (autodelete) {
      this.UnRegisterAll(msgName);
    }
    if (this.m_registeredMsgs[msgName] == null) {
      this.m_registeredMsgs[msgName] = [];
    }
    this.m_registeredMsgs[msgName].push(onMsgReceived);
  }
  public static RegisterRoot(msgName: string, onMsgReceived: Function): void {

    if (this.m_registeredMsgsRoot[msgName] == null) {
      this.m_registeredMsgsRoot[msgName] = [];
    }
    this.m_registeredMsgsRoot[msgName].push(onMsgReceived);
  }
  public static UnRegisterAll(msgName: string) {
    if (this.m_registeredMsgs[msgName] != null) {
      delete this.m_registeredMsgs[msgName];
    }
  }
  public static Clear() {
    console.log("Clear")
    this.m_registeredMsgs = {};
  }
  public static IsRegistered(msgName: string): boolean {
    if (this.m_registeredMsgs[msgName] != null) {
      return true
    } else {
      return false
    }
  }
  public static UnRegister(msgName: string, onMsgReceived: Function) {
    if (this.m_registeredMsgs[msgName] != null) {
      let index = this.m_registeredMsgs[msgName].indexOf(onMsgReceived);
      if (index > -1) {
        this.m_registeredMsgs[msgName].slice(index, 1);
      }
      if (this.m_registeredMsgs[msgName].length < 1) {
        delete this.m_registeredMsgs[msgName];
      }
    }
  }
  public static Send(msgName: string, ...arge: any[]) {

    if (this.m_registeredMsgs[msgName] != null) {
      this.m_registeredMsgs[msgName].forEach((func) => {
        func(...arge); // 確保 args 是已定義且正確的參數列表
        try {

        } catch (e) {
          // 創建一個包含錯誤詳情的物件
          const errorDetails = {
            dataName: msgName,
            dataArge: arge,
            message: e.message, // 錯誤消息
            name: e.name,       // 錯誤名稱
            stack: e.stack      // 呼叫堆疊

          };
          // 將錯誤物件轉為 JSON 字符串並記錄

          if (e instanceof Error) {
            Progarm.error("onMessage error:", e.name, e.message, e.stack);
          } else {
            Progarm.error("onMessage error:", e.message);
          }


        }


      });
    } else {
      Progarm.log("NotMsgDispatcher",msgName)

      
    }
    if (this.m_registeredMsgsRoot[msgName] != null) {
      this.m_registeredMsgsRoot[msgName].forEach((func) => {
        func(...arge); // 確保 args 是已定義且正確的參數列表
        try {

        } catch (e) {
          // 創建一個包含錯誤詳情的物件
          const errorDetails = {
            dataName: msgName,
            dataArge: arge,
            message: e.message, // 錯誤消息
            name: e.name,       // 錯誤名稱
            stack: e.stack      // 呼叫堆疊

          };
          // 將錯誤物件轉為 JSON 字符串並記錄

          if (e instanceof Error) {
            Progarm.error("onMessage error:", e.name, e.message, e.stack);
          } else {
            Progarm.error("onMessage error:", e.message);
          }


        }


      });
    }
  }
}
