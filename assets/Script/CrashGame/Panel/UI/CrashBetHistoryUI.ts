import { _decorator, Component, Node } from 'cc';
import { CrashBetHistoryView } from '../View/CrashBetHistoryView';
const { ccclass, property } = _decorator;

@ccclass('CrashBetHistoryUI')
export class CrashBetHistoryUI extends Component {
    @property(CrashBetHistoryView)
    view:CrashBetHistoryView | null = null;
    start() {

    }

    update(deltaTime: number) {
        
    }
}


