import { _decorator, Component, director, Node, resources, SpriteAtlas, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MiSystemAsset')
export class MiSystemAsset extends Component {
    private static _instance = null;

    public HeadSpriteFrame: SpriteFrame[] = [];
    public static Instance() {

        if (this._instance == null) {

        }
        return this._instance;
    }
    onLoad(){
        MiSystemAsset._instance = this;
        director.addPersistRootNode(this.node);
    }
    start() {
        
    }

    update(deltaTime: number) {
        
    }
}