import { _decorator, Component, Node, director } from "cc";
const { ccclass, property } = _decorator;

@ccclass("DontDestroyOnLoad")
export class DontDestroyOnLoad extends Component {
  start() {
    director.addPersistRootNode(this.node);
  }

  update(deltaTime: number) {}
}
