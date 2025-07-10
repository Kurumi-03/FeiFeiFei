import { _decorator, Component, Node } from 'cc';
import MsgDispatcher from '../../../Base/MsgDispatcher';
import { CrashUIType } from '../../Enum/CrashUIType';
import { PhoenixUIEvent } from '../../Event/PhoenixEvent';
import { AudioMgr } from '../../../Base/AudioMgr';
const { ccclass, property } = _decorator;

@ccclass('ClosePanelComponent')
export class ClosePanelComponent extends Component {
    start() {
        this.node.on(Node.EventType.TOUCH_END, (button) => {
            
            AudioMgr.Instance(AudioMgr).playOneShot("aud_systembtn");
            MsgDispatcher.Send(PhoenixUIEvent.CLOSE_UI.toString());
        })
    }

    update(deltaTime: number) {
        
    }
}


