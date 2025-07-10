import { _decorator, Component, Node } from 'cc';
import { CrashSpriteTextComponent } from '../../Component/CrashSpriteTextComponent';
const { ccclass, property } = _decorator;

@ccclass('CrashMHistoryBetTimesItem')
export class CrashMHistoryBetTimesItem extends Component {
    @property(Node)
    yBG:Node | null = null;
    @property(Node)
    rBG:Node | null = null;
    @property(Node)
    oBG:Node | null = null;
    @property(Node)
    gBG:Node | null = null;
    @property(Node)
    bBG:Node | null = null;
    @property(CrashSpriteTextComponent)
    txtTimes:CrashSpriteTextComponent | null = null;

    setTimes(times:number):void{
        if(times <=1){
            this.yBG.active = false;
            this.rBG.active = false;
            this.oBG.active = true;
            this.gBG.active = false;
            this.bBG.active = false;

            this.txtTimes.fontName = "H5-C-O";
        }else if(times <=2){
            this.yBG.active = false;
            this.rBG.active = false;
            this.oBG.active = false;
            this.gBG.active = true;
            this.bBG.active = false;
            
            this.txtTimes.fontName = "H5-C-G";
        }else if(times <=5){
            this.yBG.active = false;
            this.rBG.active = false;
            this.oBG.active = false;
            this.gBG.active = false;
            this.bBG.active = true;
            
            this.txtTimes.fontName = "H5-C-B";
        }else if(times <=20){
            this.yBG.active = true;
            this.rBG.active = false;
            this.oBG.active = false;
            this.gBG.active = false;
            this.bBG.active = false;
            
            this.txtTimes.fontName = "H5-C-Y";
        }else{
            this.yBG.active = false;
            this.rBG.active = true;
            this.oBG.active = false;
            this.gBG.active = false;
            this.bBG.active = false;

            this.txtTimes.fontName = "H5-C-R";
        }
        // this.txtTimes.fontName = "H4-A"
        this.txtTimes.text = times.toFixed(2);
    }
}


