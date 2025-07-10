import { _decorator, Component, Node, director, resources, sp, Prefab, SpriteAtlas, Asset, SpriteFrame, Director, instantiate, AudioClip } from 'cc';
import MsgDispatcher from './MsgDispatcher';
import { MiSystemAsset } from './MiSystemAsset';

import { Progarm } from './Progarm';
import { SystemController } from './SystemController';
import { SceneGameName } from './GameName';
const { ccclass, property } = _decorator;

@ccclass('SystemResources')
export class SystemResources extends Component {
    private static _instance: SystemResources = null;
    totalPrefabs = 0;
    totalResources = 0;
    loadedResources = 0;
    prefabProgress = 0;
    sceneProgress = 0;
    public LobbyPrefab: Prefab[] = [];
    public SharedPrefab: Prefab[] = [];
    public OncePrefab: Prefab[] = [];
    public miSp: sp.SkeletonData[] = [];
    public HeadSpriteFrame: SpriteFrame[] = [];
    public chattextpriteFrame: SpriteFrame[] = [];
    public LobbyAudio: AudioClip[] = [];
    public ChatAudio: AudioClip[] = [];

    public LobbySpriteFrame: SpriteFrame[] = [];
    public LoginPrefab: Prefab;
    countManager = 0;
    maxProgress = 0;
    public static Instance() {
        if (this._instance == null) {
            // 創建一個新的節點並添加 SystemResources 組件
            const node = new Node('SystemResources');
            this._instance = node.addComponent(SystemResources);
            // 確保該節點在場景切換時不被銷毀
            director.addPersistRootNode(node);
        }
        return this._instance;
    }
    protected onLoad(): void {
        director.on(Director.EVENT_AFTER_SCENE_LAUNCH, SystemResources._instance.OnNewScene);


    }
    OnNewScene = () => {
        try {
            var currentScene = director.getScene();
            var sceneName = currentScene.name;

            // 確保場景名稱存在於 SceneGameName 枚舉中
            if (currentScene && sceneName in SceneGameName) {

            } else {
                switch (sceneName) {
                    case "Lobby":
                        SystemResources._instance.OnNewSceneLobby();
                        break;

                    default:
                        break;
                }
            }


        } catch (e) {
            if (e instanceof Error) {
                Progarm.error(e.name, e.message, e.stack);
            } else {
                Progarm.error(e.message);
            }
        }
    }
    OnNewSceneLobby() {
        console.log("OnNewSceneLobby")
        
        SystemResources._instance.scheduleOnce(()=>{

            try {
                SystemResources._instance.countManager = 0;
                let parentNode_view = director.getScene().getChildByName("Canvas").getChildByName("PrefabPanel").getChildByName("view");
                let parentNode_manager = director.getScene().getChildByName("Canvas").getChildByName("PrefabPanel").getChildByName("manager");
                parentNode_manager.on(Node.EventType.CHILD_ADDED, SystemResources._instance.ChildAdded);
    
    
                SystemResources._instance.OncePrefab.forEach(prefab => {
                    let tmp = instantiate(prefab);
                    tmp.active = false;
                    let tmp_manager = tmp.getChildByName("manager");
                    tmp_manager.name = tmp.name;
                    parentNode_manager.addChild(tmp_manager);
                    parentNode_view.addChild(tmp);
    
                });
    
                // 遍歷加載的Prefab資源
                let instantiatedPrefabs = SystemResources._instance.LobbyPrefab.map(prefab => {
                    let tmp = instantiate(prefab);
    
                    return tmp;
                });
    

    
    
                instantiatedPrefabs.forEach(tmp => {
                    parentNode_view.addChild(tmp);
                });
    
            } catch (e) {
                if (e instanceof Error) {
                    Progarm.error(e.name, e.message, e.stack);
                } else {
                    Progarm.error(e.message);
                }
            }
        },0.5)


    }
    ChildAdded = () => {
        try {
            SystemResources._instance.countManager++
            if (SystemResources._instance.OncePrefab.length == SystemResources._instance.countManager) {
                SystemController.Instance().AddNextFrame(1, () => {
                    MsgDispatcher.Send("OncePrefabIsPass");
                })



            }
        } catch (e) {

        }

    }
    async LoadProgress(funsetProgress, CheckLogin, LoginPrefab, systemMsgPrefab) {
        const systemResources = SystemResources.Instance();
        systemResources.totalResources = 3; // 總共需要加載的資源文件夾數量

        try {
            systemResources.maxProgress = 0;
            {
                let asset_ = await systemResources.loadDirWithProgress("登入/Prefab", Prefab, funsetProgress);
                asset_.forEach((asset) => {
                    if (asset.name == "LoadingPanel") {
                        systemResources.LoginPrefab = asset;
                        LoginPrefab(asset);
                    }

                });
            }
            {
                let asset_ = await systemResources.loadDirWithProgress("共用元件", Prefab, funsetProgress);
                asset_.forEach((asset) => {
                    systemResources.SharedPrefab.push(asset);
                    if (asset.name == "系統訊息") {
                        systemMsgPrefab(asset);
                    }
                });

            }
            {

            }
            {
                let asset_ = await systemResources.loadDirWithProgress("atlas", SpriteAtlas, funsetProgress);
                asset_.forEach((asset) => {
                    if (asset.name == "FACE") {
                        systemResources.HeadSpriteFrame = asset.getSpriteFrames();
                    }
                    if (asset.name == "chattext") {
                        // 假設 asset.getSpriteFrames() 返回一個 SpriteFrame[] 陣列
                        let spriteFrames = asset.getSpriteFrames();

                        // 按名稱排序 SpriteFrame
                        spriteFrames.sort((a, b) => {
                            const nameA = a.name.toLowerCase();
                            const nameB = b.name.toLowerCase();
                            if (nameA < nameB) return -1;
                            if (nameA > nameB) return 1;
                            return 0;
                        });

                        // 清空現有的 chattextpriteFrame（如果需要的話）
                        systemResources.chattextpriteFrame = [];

                        // 將排序後的 SpriteFrame 加入到 chattextpriteFrame
                        for (let spriteFrame of spriteFrames) {
                            systemResources.chattextpriteFrame.push(spriteFrame);
                        }
                    }

                });
            }


           


            systemResources.checkAllLoaded(CheckLogin);
        } catch (err) {
            console.error("加載資源時出錯:", err);
        }
    }
    checkAllLoaded(CheckLogin) {
        const systemResources = SystemResources.Instance();
        if (systemResources.loadedResources === systemResources.totalResources ) {

            CheckLogin();
        }
    }
    updateTotalProgress(funsetProgress) {
        const systemResources = SystemResources.Instance();

        // 計算 Prefab 加載進度
        let prefabProgress = systemResources.totalPrefabs;
        // 總進度是 Prefab 加載進度和場景加載進度的平均值
        let totalProgress = (prefabProgress );
        if (totalProgress > systemResources.maxProgress) {
            systemResources.maxProgress = totalProgress;
        } else {
            totalProgress = systemResources.maxProgress;
        }
        funsetProgress(totalProgress, 0);
    }
    loadDirWithProgress<T extends Asset>(path: string, type: new () => T, funsetProgress: (progress: number) => void): Promise<T[]> {
        const systemResources = SystemResources.Instance();
        let tmp = systemResources.totalPrefabs;

        return new Promise<T[]>((resolve, reject) => {
            resources.loadDir(path, type, (completedCount, totalCount) => {
                let progress = completedCount / totalCount;

                systemResources.totalPrefabs = tmp + (progress * ((100 / systemResources.totalResources) / 100));
                systemResources.updateTotalProgress(funsetProgress);
            }, (err, assets: T[]) => {
                if (err) {
                    reject(err);
                    return;
                }
                systemResources.loadedResources++;
                systemResources.updateTotalProgress(funsetProgress);
                resolve(assets);
            });
        });
    }

    preloadSceneWithProgress(name: string, funsetProgress) {
        const systemResources = SystemResources._instance;
        return new Promise<void>((resolve, reject) => {
            director.preloadScene(name, (completedCount, totalCount) => {
                let progress = completedCount / totalCount;
                systemResources.sceneProgress = progress;
                if (systemResources.sceneProgress > 0.99) {
                    systemResources.sceneProgress = 0.99;
                }
                systemResources.updateTotalProgress(funsetProgress);
            }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                systemResources.sceneProgress = 0.99; // 場景加載完成

                systemResources.updateTotalProgress(funsetProgress);
                resolve();
            });
        });
    }
}