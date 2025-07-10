import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MsgSelectObj')
export class MsgSelectObj extends Component {
    @property(Label)
    msg: Label | null = null;
    public EmojiIdx: number = 0
    start() {

    }

    update(deltaTime: number) {

    }
}

