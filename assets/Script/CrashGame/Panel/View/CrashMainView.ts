import { _decorator, Button, Component, Label, Node, RichText, Toggle } from 'cc';
import MsgDispatcher from '../../../Base/MsgDispatcher';
import { PhoenixGameEvent } from '../../Event/PhoenixEvent';
import { CrashFontExt } from '../../Component/CrashFontExt';
import { CrashSpriteTextComponent } from '../../Component/CrashSpriteTextComponent';
import { GroupColorComponent } from '../Component/GroupColorComponent';
const { ccclass, property } = _decorator;

@ccclass('CrashMainView')
export class CrashMainView extends Component {
    @property(Button)
    btnMenu:Button | null = null;

    @property(Button)
    btnStatics:Button | null = null;

    @property(Button)
    btnSub:Button | null = null;
    
    @property(Button)
    btnAdd:Button | null = null;
    
    @property(Button)
    btnBet:Button | null = null;

    @property(Button)
    btnBetSetting:Button | null = null;
    
    @property(Button)
    btnRank:Button | null = null;

    @property(Node)
    prepareNode:Node | null = null;

    @property(Node)
    progressNode:Node | null = null;

    @property(Node)
    endNode:Node | null = null;

    @property(Toggle)
    togAutoCashOut:Toggle | null = null;

    @property(CrashSpriteTextComponent)
    txtPrepareTime:CrashSpriteTextComponent | null = null;

    @property(CrashSpriteTextComponent)
    txtProgressTime:CrashSpriteTextComponent | null = null;

    @property(CrashSpriteTextComponent)
    txtEndTime:CrashSpriteTextComponent | null = null;
    
    @property(CrashSpriteTextComponent)
    txtEndBetTimes:CrashSpriteTextComponent | null = null;
    
    @property(CrashSpriteTextComponent)
    txtBetResultMoney:CrashSpriteTextComponent | null = null;

    @property(Node)
    objBetResultNode:Node | null = null;

    @property(Node)
    historyBetTimesItem:Node | null = null;
    
    @property(Button)
    btnGetBackMoney:Button | null = null;

    @property(CrashSpriteTextComponent)
    txtGetBackMoney:CrashSpriteTextComponent | null = null;

    @property(GroupColorComponent)
    objBetGroup:GroupColorComponent | null = null;

    @property(GroupColorComponent)
    objBetButtonGroup:GroupColorComponent | null = null;

    @property(CrashSpriteTextComponent)
    txtBetMoney:CrashSpriteTextComponent | null = null;

    @property(Node)
    objBetItem:Node | null = null;

    @property(Node)
    objRankBetItem:Node | null = null;
    
    @property(Label)
    txtMyMoney:Label | null = null;

    @property(Label)
    txtMyNickname:Label | null = null;

    @property(Label)
    txtChooseCurrentBetTimes:Label | null = null;

    @property(RichText)
    txtOnlinePlayerCount:RichText | null = null;
    
    @property(RichText)
    txtResultInfo1:RichText | null = null;
    @property(RichText)
    txtResultInfo2:RichText | null = null;
    start() {
    }
    update(deltaTime: number) {
        
    }
}


