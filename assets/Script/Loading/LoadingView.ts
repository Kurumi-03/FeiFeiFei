import { _decorator, Component, Node, RichText, sys } from 'cc';
import MsgDispatcher from '../Base/MsgDispatcher';
import { LoadingManager } from './LoadingManager';
const { ccclass, property } = _decorator;

@ccclass('LoadingView')
export class LoadingView extends Component {
    @property(Node)
    main: Node | null = null;
    protected onLoad(): void {
        MsgDispatcher.Register("OpenLoadingView", this.OpenLoadingView.bind(this));
       
    }
    start() {
        
        this.main.active = false;
    }
    OpenLoadingView = () => {
        this.main.active = true;
    }
    update(deltaTime: number) {

    }
    GuestLogin() {
        LoadingManager.Instance().GuestLogin(this.GuestLoginSetp);
    }
   
    
    GuestLoginSetp = (step) => {
        
    }

   
}

