import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CrashStaticsHistoryView')
export class CrashStaticsHistoryView extends Component {
    
    @property(Node)
    objRateItem:Node | null = null;
    
    @property(Label)
    txtRateDayHigh:Label | null = null;
    @property(Label)
    txtRateGameHigh:Label | null = null;

    @property(Label)
    txtRate0:Label | null = null;
    @property(Label)
    txtRate1:Label | null = null;
    @property(Label)
    txtRate2:Label | null = null;
    @property(Label)
    txtRate3:Label | null = null;
    @property(Label)
    txtRate4:Label | null = null;
}


