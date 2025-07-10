import { _decorator, Component, director, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PoolManager')
export class PoolManager extends Component {
    // 單例模式的實例
    private static _instance: PoolManager = null;
    
    // 用於儲存不同名稱的對象池的映射
    public poolMap: { [key: string]: NodePool } = {};

    // 獲取單例實例的方法
    public static Instance(): PoolManager {
        if (this._instance == null) {
            this._instance = new PoolManager();
        }
        return this._instance;
    }

    // 當腳本加載時調用，設置單例實例並將當前節點設置為持久根節點
    protected onLoad(): void {
        PoolManager._instance = this;
        director.addPersistRootNode(PoolManager._instance.node);
    }

    start() {
        // 可以在這裡進行一些初始化操作
    }

    update(deltaTime: number) {
        // 每幀調用，可以在這裡進行一些需要每幀更新的操作
    }

    // 新增池子的方法
    private addPool(poolName: string, pool: NodePool) {
        if (!PoolManager._instance.poolMap[poolName]) {
            PoolManager._instance.poolMap[poolName] = pool;
        } else {
           // warn(`Pool with name ${poolName} already exists.`);
        }
    }

    // 獲取池子的方法
    private getPool(poolName: string): NodePool {
        return PoolManager._instance.poolMap[poolName];
    }

    // 創建其他遊戲對象的方法
    CreateOtherGame(poolName: string, OtherGame: Prefab): Node {
        let enemy: Node = null;
        let pool = PoolManager._instance.getPool(poolName);
        
        // 如果池子不存在，則創建一個新的池子並添加到映射中
        if (!pool) {
            pool = new NodePool();
            PoolManager._instance.addPool(poolName, pool);
        }

        // 如果池子中有可用的對象，則從池子中取出，否則實例化一個新的對象
        //log("pool.get()",poolName,OtherGame.name,pool.size())
        if (pool.size() > 0) {
            enemy = pool.get();
            
        } else {
            enemy = instantiate(OtherGame);
        }
        
        return enemy;
    }

    // 當其他遊戲對象被消滅時調用的方法，將對象放回池子中
    onOtherGameKilled(poolName: string, enemy: Node) {
        const pool = PoolManager._instance.getPool(poolName);
        
        // 如果池子存在，則將對象放回池子中
        if (pool) {
            pool.put(enemy); // 將節點放進對象池，這個方法會同時調用節點的 removeFromParent
        } else {
            
            //warn(`Pool with name ${poolName} not found.`);
        }
    }
}