import { _decorator, Component, Label, Node } from 'cc';
import { CrashSpriteTextComponent } from '../../Component/CrashSpriteTextComponent';
const { ccclass, property } = _decorator;

@ccclass('CrashHistoryRateItem')
export class CrashHistoryRateItem extends Component {
    @property([Node])
    imgNodes:Node[]=[];

    @property(Label)
    txtIndex:Label | null = null;
    
    @property(CrashSpriteTextComponent)
    txtTimes:CrashSpriteTextComponent | null = null;

    setData(index,times:number):void{
        this.txtIndex.string = index;
        this.setTimes(times);
    }

    setTimes(times:number):void{
        for(let i=0;i<this.imgNodes.length;i++){
            this.imgNodes[i].active = false;
        }
       
        if(times <=1){
            this.imgNodes[0].active = true;

            this.txtTimes.fontName = "H5-C-O";
        }else if(times <=2){
            this.imgNodes[1].active = true;
            
            this.txtTimes.fontName = "H5-C-G";
        }else if(times <=5){
            this.imgNodes[2].active = true;
            
            this.txtTimes.fontName = "H5-C-B";
        }else if(times <=20){
            this.imgNodes[3].active = true;
            
            this.txtTimes.fontName = "H5-C-Y";
        }else{
            this.imgNodes[4].active = true;

            this.txtTimes.fontName = "H5-C-R";
        }
        // this.txtTimes.fontName = "H4-A"
        this.txtTimes.text = times.toFixed(2);
    }
}


