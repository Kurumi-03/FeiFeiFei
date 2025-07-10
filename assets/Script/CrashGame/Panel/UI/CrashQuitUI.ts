import { _decorator, Component, Node } from 'cc';
import { CrashQuitView } from '../View/CrashQuitView';
const { ccclass, property } = _decorator;

@ccclass('CrashQuitUI')
export class CrashQuitUI extends Component {
    @property(CrashQuitView)
    view:CrashQuitView | null = null;
    start() {

    }

    update(deltaTime: number) {
        
    }
}


