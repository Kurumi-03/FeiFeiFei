import { _decorator, Component, Node} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CrashGameBGHorizontalMoveComponent')
export default class CrashGameBGHorizontalMoveComponent extends Component {
    @property({
        type: [Node]
    })
    bgList: Node[] = []; // 背景节点数组

    @property
    moveSpeed: number = 5; // 滚动速度

    trigger: number;

    onLoad() {
        // 初始化触发器位置（通常是第一张背景图片的高度或宽度的负值）
        this.trigger = 1920;
    }

    setMoveSpeed(speed: number,rate:number=1) {
        this.moveSpeed = Math.abs(speed*rate);
    }

    update(dt: number) {
        let outTriggerBg = null;
        let maxBgPos = 0;
        for (let i = 0; i < this.bgList.length; i++) {
            // 检测背景节点是否滚出屏幕
            if (this.bgList[i].position.x <= -this.trigger) {
                outTriggerBg = this.bgList[i];
            }
            // 移动背景节点
            let posx = this.bgList[i].position.x - this.moveSpeed; // 计算当前背景节点的新位置
            this.bgList[i].setPosition(posx, this.bgList[i].position.y);
            if(posx>maxBgPos)
            {
                maxBgPos = posx;
            }
        }

         // 重置背景节点的位置到最后一个背景节点的位置
         if (outTriggerBg) {
             outTriggerBg.setPosition(
                maxBgPos+1280,
                outTriggerBg.position.y,
            );
        }
    }

    // 控制滚动开始和停止的方法（可选）
    startScrolling() {
        // 这里可以添加逻辑来开始滚动，例如设置一个标志位
    }

    stopScrolling() {
        for (let i = 0; i < this.bgList.length; i++) {
            this.bgList[i].setPosition(
                1280*i-1920,
                this.bgList[i].position.y,
            );
        }
    }
}
