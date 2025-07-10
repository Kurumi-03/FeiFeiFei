// MiIP.ts




export enum DevSceneGameName {
    Null,
    Phoenix,
}

export enum SceneGameName {
    Null = "Null",
    Phoenix = "Phoenix",

}
export enum ServerGameName {
    Null = "Null",
    Phoenix = "Phoenix",
}
export enum ServerGameNum {
    Null = "Null",
  
}
export function mapSceneNameToServerGameNum(sceneGameName: SceneGameName): string {
    return null
}
export function mapSceneNameToServerGameStr(sceneGameName: SceneGameName): string {
    let serverGameName: string;


    // Remove the underscore and return the number only
    return serverGameName;
}
// 映射函数
export function mapDevToSceneGameName(game: DevSceneGameName): SceneGameName {
    return SceneGameName[DevSceneGameName[game]];
}
export function mapSceneToServer(game: number): ServerGameName {
    return ServerGameName[DevSceneGameName[game]];
}
export function mapServerToSceneGameName(serverGameName: ServerGameName): string {
    return SceneGameName[DevSceneGameName[serverGameName]];

}
export function mapServerNumToSceneGameNameDirect(serverGameNum: string): SceneGameName {
    return null
}
export function mapServerNumToServerGameName(serverGameNum: string): string {
    return null
}
export function mapServerNumToGameName(serverGameNum: string): string {
   return null
}
