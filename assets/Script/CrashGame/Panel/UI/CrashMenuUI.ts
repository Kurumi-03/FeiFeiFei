import { _decorator, Component, Node } from 'cc';
import { CrashMenuView } from '../View/CrashMenuView';
import MsgDispatcher from '../../../Base/MsgDispatcher';
import { CrashUIType } from '../../Enum/CrashUIType';
import { PhoenixUIEvent } from '../../Event/PhoenixEvent';
import { AudioMgr } from '../../../Base/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('CrashMenuUI')
export class CrashMenuUI extends Component {
    @property(CrashMenuView)
    view:CrashMenuView | null = null;
    start() {
        this.view.btnRule.on(Node.EventType.TOUCH_START, (button) => {
            AudioMgr.Instance(AudioMgr).playOneShot("aud_systembtn");
            MsgDispatcher.Send(PhoenixUIEvent.SHOW_UI.toString(),CrashUIType.RuleUI);
        })

        this.view.btnHistory.on(Node.EventType.TOUCH_START, (button) => {
            AudioMgr.Instance(AudioMgr).playOneShot("aud_systembtn");
            MsgDispatcher.Send(PhoenixUIEvent.SHOW_UI.toString(),CrashUIType.BetHistoryUI);
        })

        this.view.btnQuit.on(Node.EventType.TOUCH_START, (button) => {
            AudioMgr.Instance(AudioMgr).playOneShot("aud_systembtn");
            MsgDispatcher.Send(PhoenixUIEvent.SHOW_UI.toString(),CrashUIType.QuitUI);
        })

        this.view.btnSetting.on(Node.EventType.TOUCH_START, (button) => {
            AudioMgr.Instance(AudioMgr).playOneShot("aud_systembtn");
            MsgDispatcher.Send(PhoenixUIEvent.SHOW_UI.toString(),CrashUIType.SettingsUI);
        })
    }

    update(deltaTime: number) {
        
    }
}


