import { _decorator, Component, EventHandler, Node, Slider } from 'cc';
import { CrashBetSettingView } from '../View/CrashBetSettingView';
import MsgDispatcher from '../../../Base/MsgDispatcher';
import { PhoenixGameEvent } from '../../Event/PhoenixEvent';
const { ccclass, property } = _decorator;

@ccclass('CrashBetSettingUI')
export class CrashBetSettingUI extends Component {
    @property(CrashBetSettingView)
    view:CrashBetSettingView | null = null;
    start() {
        const sliderEventHandler = new EventHandler();
        // 这个 node 节点是事件处理脚本组件所属的节点
        sliderEventHandler.target = this.node; 
        // 这个是脚本类名
        sliderEventHandler.component = 'CrashBetSettingUI';
        sliderEventHandler.handler = '_sliderBetTimesCallback';
        sliderEventHandler.customEventData = 'foobar';

        this.view.sliderBetTimes.slideEvents.push(sliderEventHandler);
    }

    _sliderBetTimesCallback(slider: Slider, customEventData: string) {
        this.view.barBetTimes.progress = slider.progress;

        let betTimes:number = this.getBetTimes(slider.progress);
        this.view.txtCurBetTimes.string = betTimes.toFixed(2);

        MsgDispatcher.Send(PhoenixGameEvent.CHOOSE_BET_TIMES_EVENT.toString(),this.view.txtCurBetTimes.string);
    }

    getBetTimes(progress: number) {
        if (progress >= 0 && progress <= 0.08) {
            return progress/0.08*1.5;
        } else if (progress > 0.08 && progress <= 0.28) {
            return (progress-0.08)/0.2*1.5+1.5;
        } else if (progress > 0.28 && progress <= 0.48) {
            return (progress-0.28)/0.2*2.5+2.5;
        } else if (progress > 0.48 && progress <= 0.68) {
            return (progress-0.48)/0.2*4.5+5.5;
        } else if (progress > 0.68 && progress <= 1) {
            return (progress-0.68)/0.3*999+9.5;
        }
        return 0.01;
    }
}


