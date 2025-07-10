import { _decorator, Button, Color, Component, Label, Node, ProgressBar, Sprite } from 'cc';
import { CrashSpriteTextComponent } from '../../Component/CrashSpriteTextComponent';
const { ccclass, property } = _decorator;

@ccclass('GroupColorComponent')
export class GroupColorComponent extends Component {
    coloredChildren: Node[];
    onLoad() {
        this.coloredChildren = this.node.children.filter((child) => {
            return child.getComponent(Sprite)||
            child.getComponent(Label)||
            child.getComponent(Button)||
            child.getComponent(CrashSpriteTextComponent);
        });
    }

    setColor(color:Color) {
        this.coloredChildren.forEach((child) => {
            if (child.getComponent(Sprite)) {
                child.getComponent(Sprite).color = color;
            } else if (child.getComponent(Label)) {
                child.getComponent(Label).color = color;
            } else if (child.getComponent(CrashSpriteTextComponent)) {
                child.getComponent(CrashSpriteTextComponent).setColor(color);
            }
        });
    }
}