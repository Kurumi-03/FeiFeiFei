import { CCString,CCInteger, _decorator } from "cc";
const {ccclass,property } = _decorator;

@ccclass('CrashFontExt')
export class CrashFontExt {
    @property({
        type: CCString,
    })
    char:string="";
    @property({
        type: CCInteger,
    })
    offsetY:number = 0;
}