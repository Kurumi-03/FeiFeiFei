import { _decorator, Component } from 'cc';
export default abstract class Singleton<T> extends Component {
    public static Instance<T>(c: {new(): T; }) : T{
        
        if (this._instance == null){
            this._instance = new c();
        }
        return this._instance;
    }
    protected static _instance = null;
}


