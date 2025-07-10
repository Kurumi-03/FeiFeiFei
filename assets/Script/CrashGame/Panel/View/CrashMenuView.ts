import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CrashMenuView')
export class CrashMenuView extends Component {
    @property(Node)
    btnRule:Node | null = null;
    @property(Node)
    btnHistory:Node | null = null;
    @property(Node)
    btnSetting:Node | null = null;
    @property(Node)
    btnQuit:Node | null = null;
    start() {

    }

    update(deltaTime: number) {
        
    }
}


