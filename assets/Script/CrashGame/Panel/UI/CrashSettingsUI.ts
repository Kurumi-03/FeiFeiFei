import { _decorator, Component, Node } from 'cc';
import { CrashSettingsView } from '../View/CrashSettingsView';
const { ccclass, property } = _decorator;

@ccclass('CrashSettingsUI')
export class CrashSettingsUI extends Component {
    @property(CrashSettingsView)
    view:CrashSettingsView | null = null;
    start() {

    }

    update(deltaTime: number) {
        
    }
}


