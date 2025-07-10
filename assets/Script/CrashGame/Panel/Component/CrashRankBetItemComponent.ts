import { _decorator, Component, Node } from 'cc';
import MsgDispatcher from '../../../Base/MsgDispatcher';
import { PhoenixDataEvent } from '../../Event/PhoenixEvent';
import { CrashSpriteTextComponent } from '../../Component/CrashSpriteTextComponent';
import { CrashGameState } from '../../Enum/CrashGameState';
import { PhoenixGameNetManager } from '../../Net/PhoenixGameNetManager';
import { CrashGameApp } from '../../CrashGameApp';
const { ccclass, property } = _decorator;

@ccclass('CrashRankBetItemComponent')
export class CrashRankBetItemComponent extends Component {
   
    @property(Node)
    objGetBack: Node = null!;

    @property(Node)
    objAlreadyGetBackBG: Node = null!;

    @property([Node])
    objStarsArr: Node[] = [];

    @property(CrashSpriteTextComponent)
    txtBetMoney: CrashSpriteTextComponent = null!;

    @property(CrashSpriteTextComponent)
    txtBetTimes: CrashSpriteTextComponent = null!;

    @property(CrashSpriteTextComponent)
    txtRankIndex: CrashSpriteTextComponent = null!;

    index: number;
    curBetData: any;
    alreadyGetBack: boolean = false;

    start(): void {
       
    }

    getPlayerID()
    {
        return this.curBetData.Id;
    }

    setBetInfo(betData,index:number): void {
        this.alreadyGetBack = false;
        this.curBetData = betData;
        this.index = index;
        this.txtBetMoney.text = betData.TotalBetAmount.toString();
        this.objAlreadyGetBackBG.active = false;
        this.txtBetTimes.node.active = false;
        this.txtRankIndex.text = (index+1).toString();
    }

    setRank(index: number)
    {
        this.index = index;
        this.txtRankIndex.text = (index+1).toString();
    }

    setAlreadyGetBack(betTimes: number): void {
        this.alreadyGetBack = true;
        this.objAlreadyGetBackBG.active = true;
        this.txtBetTimes.node.active = true;
        if(betTimes==undefined)
        {
            betTimes =PhoenixGameNetManager.Instance(PhoenixGameNetManager).getCurRoundRate()
        }
        this.txtBetTimes.text = betTimes.toFixed(2)+"x";
        this.updateMoney();
    }

    update(dt: number): void {
        // if (CrashGameApp.Instance().getCurGameState() == CrashGameState.StartShowdown) {
        //     if (!this.alreadyGetBack) {
        //         this.updateMoney();
        //     }
        // }
    }

    updateMoney(): void {
        let curRate =PhoenixGameNetManager.Instance(PhoenixGameNetManager).getCurRoundRate()
        this.txtBetMoney.text = (this.curBetData.TotalBetAmount * curRate).toFixed(2);
    }
}


