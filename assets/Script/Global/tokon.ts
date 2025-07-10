import { _decorator, Component, Node, director } from "cc";
const { ccclass, property } = _decorator;

@ccclass("tokon")
export class tokon extends Component {
  private static instance: tokon = null;

  // 定义用户数据资料
  public roomTokon: string = "";
  public SyncId: Number = 0;
  public acc: string = "";
  public pswd: string = "";
  // 使用 onLoad 而不是 start，因为 onLoad 更早被调用
  onLoad() {
    if (tokon.instance === null) {
      // 如果没有现有的实例，则将此实例设置为单例
      tokon.instance = this;
    } else {
      // 如果已存在实例，则销毁新创建的组件
      this.node.destroy();
    }
  }

  // 保留 update 函数，如果您需要它
  update(deltaTime: number) {
    // ...
  }

  // 静态方法来获取单例实例
  public static getInstance(): tokon {
    if (!tokon.instance) {
      // 如果没有实例存在，就在场景中找到一个
      // 这是为了防止场景中没有事先放置 tokon 节点的情况
      const existingNode = director.getScene().getChildByName("tokon");
      if (existingNode) {
        tokon.instance = existingNode.getComponent(tokon);
      } else {
        // 如果场景中也不存在，则创建一个新节点
        const newNode = new Node("tokon");
        tokon.instance = newNode.addComponent(tokon);
        director.getScene().addChild(newNode);
        
      }
    }

    return tokon.instance;
  }
  start() {}
}
