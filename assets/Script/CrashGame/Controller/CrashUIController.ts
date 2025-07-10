import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { PhoenixGameEvent, PhoenixUIEvent } from '../Event/PhoenixEvent';
import { Progarm } from '../../Base/Progarm';
import { CrashGameApp } from '../CrashGameApp';
import MsgDispatcher from '../../Base/MsgDispatcher';
import { CrashBetHistoryUI } from '../Panel/UI/CrashBetHistoryUI';
import { CrashMenuUI } from '../Panel/UI/CrashMenuUI';
import { CrashQuitUI } from '../Panel/UI/CrashQuitUI';
import { CrashRankUI } from '../Panel/UI/CrashRankUI';
import { CrashRuleUI } from '../Panel/UI/CrashRuleUI';
import { CrashSettingsUI } from '../Panel/UI/CrashSettingsUI';
import { CrashStaticsHistoryUI } from '../Panel/UI/CrashStaticsHistoryUI';
import { CrashBetSettingUI } from '../Panel/UI/CrashBetSettingUI';

@ccclass('CrashUIController')
export class CrashUIController extends Component {
    @property(CrashBetHistoryUI)
    betHistoryUI:CrashBetHistoryUI | null = null;
    @property(CrashMenuUI)
    menuUI:CrashMenuUI | null = null;
    @property(CrashQuitUI)
    quitUI:CrashQuitUI | null = null;
    @property(CrashRankUI)
    rankUI:CrashRankUI | null = null;
    @property(CrashRuleUI)
    ruleUI:CrashRuleUI | null = null;
    @property(CrashSettingsUI)
    settingsUI:CrashSettingsUI | null = null;
    @property(CrashStaticsHistoryUI)
    staticsHistoryUI:CrashStaticsHistoryUI | null = null;
    @property(CrashBetSettingUI)
    betSetingUI:CrashBetSettingUI | null = null;

    public uiList=null;

    private static _instance = null;

    public static Instance() {
        if (this._instance == null) {
            return;
        }
        return this._instance;
    }

    onLoad(){
        CrashUIController._instance = this;

        this.uiList=[
            this.betHistoryUI,
            this.menuUI,
            this.quitUI,
            this.rankUI,
            this.ruleUI,
            this.settingsUI,
            this.staticsHistoryUI,
            this.betSetingUI,
        ];
    

        MsgDispatcher.Register(PhoenixUIEvent.SHOW_UI.toString(), this.onShowUI);
        MsgDispatcher.Register(PhoenixUIEvent.CLOSE_UI.toString(), this.onCloseUI);
    }
    
    start() {
        
    }

    update(deltaTime: number) {
    }

    onEnable () {
        
    }

    onDisable () {
        MsgDispatcher.UnRegister(PhoenixUIEvent.SHOW_UI.toString(), this.onShowUI);
        MsgDispatcher.UnRegister(PhoenixUIEvent.CLOSE_UI.toString(), this.onCloseUI);
    }

    onShowUI(uiType,data,isCloseOthers=true)
    {
        if(isCloseOthers)
        {
            CrashUIController.Instance().uiList.forEach(element => {
                element.node.active = false;
            });
        }
        
        Progarm.log("onShowUI");
        CrashUIController.Instance().uiList[uiType].node.active = true;
    }

    onCloseUI(uiType,isCloseOthers=true)
    {
        Progarm.log("onCloseUI");
        if(isCloseOthers)
        {
            CrashUIController.Instance().uiList.forEach(element => {
                element.node.active = false;
            });
        }
        else
        {
            CrashUIController.Instance().uiList[uiType].node.active = false;
        }
    }
}


