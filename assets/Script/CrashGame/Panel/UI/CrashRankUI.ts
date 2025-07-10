import { _decorator, Component, Node } from 'cc';
import { CrashRankView } from '../View/CrashRankView';
const { ccclass, property } = _decorator;

@ccclass('CrashRankUI')
export class CrashRankUI extends Component {
    
    @property(CrashRankView)
    view:CrashRankView | null = null;

    start() {

    }

    update(deltaTime: number) {
        
    }
}


