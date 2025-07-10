import { _decorator, Component, Node } from 'cc';
import MsgDispatcher from '../../../Base/MsgDispatcher';
import { PhoenixDataEvent } from '../../Event/PhoenixEvent';
import { CrashSpriteTextComponent } from '../../Component/CrashSpriteTextComponent';
import { CrashGameState } from '../../Enum/CrashGameState';
import { PhoenixGameNetManager } from '../../Net/PhoenixGameNetManager';
import { CrashGameApp } from '../../CrashGameApp';
const { ccclass, property } = _decorator;

@ccclass('CrashBetItemComponent')
export class CrashBetItemComponent extends Component {
    @property(Node)
    btnGetBack: Node = null!;

    @property(Node)
    objGetBack: Node = null!;

    @property(Node)
    objAlreadyGetBackBG: Node = null!;

    @property(CrashSpriteTextComponent)
    txtBetMoney: CrashSpriteTextComponent = null!;

    @property(CrashSpriteTextComponent)
    txtBetTimes: CrashSpriteTextComponent = null!;
    index: number;
    curBetData: any;
    alreadyGetBack: boolean = false;

    start(): void {
        this.btnGetBack.on(Node.EventType.TOUCH_END, (button) => {
            this.reqGetBack();
        })
    }

    reqGetBack(): void {
        MsgDispatcher.Send(PhoenixDataEvent.REQ_GET_BACK_EVENT.toString(), this.curBetData);
    }

    setBetInfo(betData,index:number): void {
        this.alreadyGetBack = false;
        this.curBetData = betData;
        this.index = index;
        this.txtBetMoney.text = betData.BetAmount.toString();
        this.objAlreadyGetBackBG.active = false;
        this.txtBetTimes.node.active = false;
        this.btnGetBack.active = true;
        // this.txtBetTimes.text = betTimes.toFixed(2)+"x";
        console.error("betData------------------------>", betData.BetAmount);
        this.objGetBack.active = false;
        if(this.curBetData.CashedOut)
        {
            this.txtBetMoney.text = betData.WinAmount.toFixed(2).toString();
            this.setAlreadyGetBack(betData.Multiplier);
        }
    }

    setViewByState(state: number): void {
        this.objGetBack.active = !this.curBetData.CashedOut&&state == CrashGameState.StartShowdown;
    }

    getCurBetID():string {
        return this.curBetData.BetId;
    }

    setAlreadyGetBack(betTimes: number): void {
        this.alreadyGetBack = true;
        this.objAlreadyGetBackBG.active = true;
        this.btnGetBack.active = false;
        this.txtBetTimes.node.active = true;
        this.txtBetTimes.text = betTimes.toFixed(2)+"x";
        this.objGetBack.active = false;

        this.updateMoney();
    }

    update(dt: number): void {
        if (CrashGameApp.Instance().getCurGameState() == CrashGameState.StartShowdown) {
            if (!this.alreadyGetBack) {
                this.updateMoney();
            }
        }
    }

    updateMoney(): void {
        if(this.curBetData.CashedOut)return;
        
        let curRate =PhoenixGameNetManager.Instance(PhoenixGameNetManager).getCurRoundRate()
        this.txtBetMoney.text = (this.curBetData.BetAmount * curRate).toFixed(2);
    }
}


