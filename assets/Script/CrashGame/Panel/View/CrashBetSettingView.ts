import { _decorator, Component, Label, Node, ProgressBar, Slider } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CrashBetSettingView')
export class CrashBetSettingView extends Component {
    @property(Slider)
    sliderBetTimes: Slider = null!;
    @property(Label)
    txtCurBetTimes: Label = null!;
    @property(ProgressBar)
    barBetTimes: ProgressBar = null!;
}


