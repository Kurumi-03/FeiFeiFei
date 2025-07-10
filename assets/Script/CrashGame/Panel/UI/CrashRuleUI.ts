import { _decorator, Component, Node } from 'cc';
import { CrashRuleView } from '../View/CrashRuleView';
const { ccclass, property } = _decorator;

@ccclass('CrashRuleUI')
export class CrashRuleUI extends Component {
    @property(CrashRuleView)
    view:CrashRuleView | null = null;
    start() {

    }

    update(deltaTime: number) {
        
    }
}


