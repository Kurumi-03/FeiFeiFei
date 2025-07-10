import { _decorator, Component, Node } from 'cc';
import { Progarm } from '../Base/Progarm';
const { ccclass, property } = _decorator;

@ccclass('ActNode')
export class ActNode extends Component {
    @property(Node)
    obj:Node | null = null;
    @property(Node)
    objClose:Node | null = null;
    start() {
        
    }

    update(deltaTime: number) {
        
    }
    Open(){
        try{
            this.obj.active=true;
            if(this.objClose!=null){
                this.objClose.active=false;
            }
        }catch(e){
            Progarm.error("ActNodeOpen");
        }
        
        

    }
    Close(){
        try{
            this.obj.active=false;
        }catch(e){
            Progarm.error("ActNodeClose");
        }
        
    }

}

