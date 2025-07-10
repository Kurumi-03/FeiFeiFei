import { _decorator, assetManager, Component, director, error, game, ImageAsset, js, Label, loader, log, Node, profiler, renderer, sp, SpriteFrame, sys, Texture2D, Toggle, ToggleContainer, Tween, UITransform, Vec3 } from 'cc';
import { LogLevel } from './LogLevel';
import { PREVIEW } from 'cc/env';
import { MiSystemAsset } from './MiSystemAsset';
import Logger from './Logger';
import { SystemMsg } from './SystemMsg';
import { SystemResources } from './SystemResources';
import { SystemController } from './SystemController';

const { ccclass, property } = _decorator;

@ccclass('Progarm')
export class Progarm extends Component {

    private static remoteLogging: boolean = true;  // 控制是否啟用遠程日誌記錄
    private static logLevel: LogLevel = LogLevel.DEBUG;
    private static readonly sceneMap = new Map([
        ['Loading', 'Loading'],
        ['Lobby', 'Lobby']
        // 添加其他場景映射
    ]);

    private static readonly messageTypeMap = new Map([
        ['SendRequestConfirm_send', 'SendRequestConfirm_send'],
        ['Request successful:', 'Request successful:'],
        ['SocketMessage:', 'SocketMessage']
        // 添加其他消息類型映射
    ]);

    public static log(...message: any[]): void {
        console.error("log :",message.toString());
        const scene = director.getScene().name;
        const date = new Date();
        const timestamp = `${date.getFullYear() % 100}-${Logger.padZero(date.getMonth() + 1)}-${Logger.padZero(date.getDate())} ${Logger.padZero(date.getHours())}:${Logger.padZero(date.getMinutes())}:${Logger.padZero(date.getSeconds())}`;
        const platformInfo = `DB-${sys.os.toUpperCase()}`;

        const error = new Error();
        const stackLine = error.stack?.split("\n")[2] || "No stack";
        const callerInfo = stackLine.split('/').pop()?.trim() || "Unknown";

        let logMessage = `[${timestamp}][${scene}][${platformInfo}] ${callerInfo}\n`;

        message.forEach((msg, index) => {
            let formattedMsg;
            if (typeof msg === 'string') {
                formattedMsg = this.messageTypeMap.get(msg) || msg;
            } else {
                try {
                    formattedMsg = JSON.stringify(msg, null, 0);
                } catch (error) {
                    formattedMsg = String(msg);
                }
            }
            logMessage += `M${index + 1}: ${formattedMsg}\n`;
        });

        console.log(logMessage);
        //Logger.addLog(logMessage, LogLevel.INFO);
        if (!PREVIEW) {
            Logger.addLog(logMessage, LogLevel.INFO);
        }
    }


    public static error(...message: any[]): void {
        
        console.error("logerror : ",message.toString());


        const scene = director.getScene()?.name?.substring(0, 2) || "UN";
        const date = new Date();
        const timestamp = `${date.getFullYear() % 100}${Logger.padZero(date.getMonth() + 1)}${Logger.padZero(date.getDate())}${Logger.padZero(date.getHours())}${Logger.padZero(date.getMinutes())}`;
        const platformInfo = '';//`${sys.platform.substring(0, 2)}${sys.os.substring(0, 2)}${sys.isMobile ? 'M' : 'D'}`;

        let logMessage = `[${timestamp}][${scene}][${platformInfo}]`;

        message.forEach((msg, index) => {
            logMessage += `\nM${index + 1}:`;
            logMessage += this.stringifyObject(msg);
        });

        if ('connection' in navigator && navigator['connection']) {
            const conn = navigator['connection'] as any;
            logMessage += `\nNT:${conn.effectiveType || 'unknown'},DS:${conn.downlink || 'unknown'}Mbps`;
        }

        // if (performance) {
        //     const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        //     if (navEntry) {
        //         logMessage += `,LT:${Math.round(navEntry.loadEventEnd - navEntry.startTime)}ms`;
        //     }
        // }

        // if (performance && (performance as any).memory) {
        //     const memoryInfo = (performance as any).memory;
        //     logMessage += `,MU:${(memoryInfo.usedJSHeapSize / 1048576).toFixed(0)}MB`;
        // }

        if (game) {
            logMessage += `\nFPS:${director.root.fps.toFixed(0)},SC:${director.getScene().name},RT:${game.renderType}`;
        }

        logMessage += `,LS:${JSON.stringify(localStorage).length}B`;

        Logger.error(logMessage);
        if (!PREVIEW) {
            Logger.addLog(logMessage, LogLevel.ERROR);
        } else {

        }
    }
    static jsonToUint8Array(jsonObj: { [key: string]: number }): Uint8Array {
        const length = Object.keys(jsonObj).length;
        const uint8Array = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            uint8Array[i] = jsonObj[i];
        }
        return uint8Array;
    }
    static decodeMessageContent(content: Uint8Array): any {
        const decoder = new TextDecoder('utf-8');
        const decodedString = decoder.decode(content);

        console.log("解碼後的字串:", decodedString);

        // 嘗試解析為 JSON
        try {
            return JSON.parse(decodedString);
        } catch (error) {
            console.log("無法解析為 JSON，返回原始字串");
            return decodedString;
        }
    }
    private static stringifyObject(obj: any, depth: number = 0): string {
        if (depth > 2) return '[Object]'; // 限制遞迴深度
        if (typeof obj !== 'object' || obj === null) return String(obj);

        if (obj instanceof Error) {
            return `${obj.name}: ${obj.message}${obj.stack ? ` at ${obj.stack.split('\n')[1]?.trim()}` : ''}`;
        }

        if (Array.isArray(obj)) {
            return `[${obj.map(item => this.stringifyObject(item, depth + 1)).join(', ')}]`;
        }

        // 使用 Object.keys() 替代 Object.entries()
        const entries = Object.keys(obj).map(key =>
            `${key}: ${this.stringifyObject(obj[key], depth + 1)}`
        );

        return `{${entries.join(', ')}}`;
    }



    private static formatDetailedError(error: Error): string {
        let result = `  錯誤類型: ${error.name}\n`;
        result += `  錯誤訊息: ${error.message}\n`;
        if (error.stack) {
            result += `  堆疊追蹤:\n${error.stack.split('\n').map(line => `    ${line.trim()}`).join('\n')}\n`;
        }
        // 添加額外的錯誤屬性（如果有的話）
        for (const key in error) {
            if (error.hasOwnProperty(key) && !['name', 'message', 'stack'].includes(key)) {
                result += `  ${key}: ${Progarm.formatDetailedValue(error[key])}\n`;
            }
        }
        return result;
    }
    public static openWebsite(url: string) {
        // 添加時間戳和 Line 特定參數
        const finalUrl = new URL(url);
        finalUrl.searchParams.append('t', Date.now().toString());
        finalUrl.searchParams.append('openExternalBrowser', '1');

        // 開啟網站
        window.open(finalUrl.toString(), '_blank');
    }

    private static formatDetailedValue(value: any, depth: number = 0): string {
        const indent = '  '.repeat(depth);
        if (value === null) return `${indent}null\n`;
        if (value === undefined) return `${indent}undefined\n`;
        if (typeof value !== 'object') return `${indent}${value}\n`;

        let result = '';
        if (Array.isArray(value)) {
            result += `${indent}陣列 (長度: ${value.length}) [\n`;
            value.forEach((item, index) => {
                result += `${indent}  [${index}]: ${Progarm.formatDetailedValue(item, depth + 1)}`;
            });
            result += `${indent}]\n`;
        } else {
            result += `${indent}物件 {\n`;
            for (const key in value) {
                if (value.hasOwnProperty(key)) {
                    result += `${indent}  ${key}: ${Progarm.formatDetailedValue(value[key], depth + 1)}`;
                }
            }
            result += `${indent}}\n`;
        }
        return result;
    }
    static getRandom(min, max) {
        return Math.floor(Math.random() * max) + min;
    };
    static lerp(start: number, end: number, t: number): number {
        return start + (end - start) * t;
    }
    static preloadScene(name: string) {
        try {
            SystemMsg.Instance().ShowLoading(true, "-1");
            if (PREVIEW || !sys.isNative) {
                SystemMsg.Instance().ShowLoading(true, "-1");
                director.preloadScene(name, (completedCount, totalCount) => {

                }, async (e) => {

                });
                director.loadScene(name, function (err, scene) {
                    if (err) {
                        error("Error loading scene:", err);
                    }
                    SystemMsg.Instance().ShowLoading(false, "-1");

                });
            } else {
                SystemMsg.Instance().ShowLoading(true, "-1");
                director.preloadScene(name, (completedCount, totalCount) => {

                }, async (e) => {
                    try {
                        director.loadScene(name, function (err, scene) {
                            if (err) {
                                error("Error loading scene:", err);
                            }
                            SystemMsg.Instance().ShowLoading(false, "-1");


                        });
                    } catch (error) {
                        error("Error during scene preloading:", error);
                        SystemMsg.Instance().ShowLoading(false, "-1");
                    }
                });
            }
        } catch (error) {
            error("Error in preloadScene:", error);
            SystemMsg.Instance().ShowLoading(false, "-1");
        }
    }



    static LoadScene(name: string) {
        try {
            SystemMsg.Instance().ShowLoading(true, "-1");

            if (PREVIEW || !sys.isNative) {
                director.loadScene(name, function (err, scene) {
                    if (err) {
                        error("Error loading scene:", err);
                    }
                    SystemMsg.Instance().ShowLoading(false, "-1");

                });
            } else {
                director.loadScene(name, function (err, scene) {
                    if (err) {
                        error("Error loading scene:", err);
                    }
                    SystemMsg.Instance().ShowLoading(false, "-1");

                });
            }

        } catch (error) {
            error("Error in loadScene:", error);
            SystemMsg.Instance().ShowLoading(false, "-1");
        }
    }
    static LoadScene2(name: string) {
        try {
            if (PREVIEW || !sys.isNative) {
                director.loadScene(name, function (err, scene) {
                    if (err) {
                        error("Error loading scene:", err);
                    }
                    SystemMsg.Instance().ShowLoading(false, "-1");

                });
            } else {
                director.loadScene(name, function (err, scene) {
                    if (err) {
                        error("Error loading scene:", err);
                    }
                    SystemMsg.Instance().ShowLoading(false, "-1");

                });
            }

        } catch (error) {
            error("Error in loadScene:", error);
            SystemMsg.Instance().ShowLoading(false, "-1");
        }
    }
    static InLoadingLoadScene(name: string) {
        try {


            if (PREVIEW || !sys.isNative) {
                director.loadScene(name, function (err, scene) {
                    if (err) {
                        error("Error loading scene:", err);
                    }


                });
            } else {
                director.loadScene(name, function (err, scene) {
                    if (err) {
                        error("Error loading scene:", err);
                    }


                });
            }

        } catch (error) {
            error("Error in loadScene:", error);

        }
    }
    static InitTimeStr(StartTime, EndTime, StartTime_txt, EndTime_txt) {
        const date = new Date();
        date.setHours(12, 0, 0, 0); // 將時間設置為今天的00:00
        let dateStart = new Date(date); // 今天的00:00
        StartTime = dateStart;
        let dateEnd = new Date();
        dateEnd.setDate(dateEnd.getDate() + 1);
        dateEnd.setHours(11, 59, 59, 999);
        EndTime = dateEnd;
        StartTime_txt.string = [dateStart.getFullYear(), dateStart.getMonth() + 1, dateStart.getDate()].join('-');
        EndTime_txt.string = [dateEnd.getFullYear(), dateEnd.getMonth() + 1, dateEnd.getDate()].join('-');
        return {
            StartTime: dateStart,
            EndTime: dateEnd,
        };
    }
    static GetDateInterval(Interval: string) {
        switch (Interval) {
            case "1":
                {
                    //昨天
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    // 計算昨天的日期，並設定開始時間為中午12點
                    const startTime = new Date(today);
                    startTime.setDate(today.getDate() - 1);
                    startTime.setHours(12, 0, 0, 0);

                    // 設定結束時間為今天的11:59:59.999
                    const endTime = new Date(today);
                    endTime.setHours(11, 59, 59, 999);
                    return {
                        StartTime: startTime,
                        EndTime: endTime,
                    };
                }

                break;
            case "2":
                {
                    // 設定開始時間為今天中午12點
                    const startTime = new Date();
                    startTime.setHours(12, 0, 0, 0);

                    // 設定結束時間為明天上午11點59分59秒999毫秒
                    const endTime = new Date();
                    endTime.setDate(endTime.getDate() + 1);
                    endTime.setHours(11, 59, 59, 999);

                    return {
                        StartTime: startTime,
                        EndTime: endTime,
                    };
                }

                break;
            case "3":
                //上週
                {
                    
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); 

                  
                    const dayOfWeek = today.getDay();

                   
                    const startOfLastWeek = new Date(today);
                    startOfLastWeek.setDate(today.getDate() - dayOfWeek - 7);
                    startOfLastWeek.setHours(12, 0, 0, 0); 

                 
                    const endOfLastWeek = new Date(startOfLastWeek);
                    endOfLastWeek.setDate(startOfLastWeek.getDate() + 7); 
                    endOfLastWeek.setHours(11, 59, 59, 999); 
                    return {
                        StartTime: startOfLastWeek,
                        EndTime: endOfLastWeek,
                    };

                }
                break;
            case "4":
                //本週
                {
                    // 獲取今天的日期
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // 將時間設置為今天的00:00

                    // 獲取今天是這周的第幾天（0 = 星期日, 1 = 星期一, ..., 6 = 星期六）
                    const dayOfWeek = today.getDay();

                    // 計算本週的開始時間（上週日的00:00）
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - dayOfWeek); // 上週日的日期
                    startOfWeek.setHours(12, 0, 0, 0); // 將時間設置為00:00

                    // 計算本週的結束時間（這週六的23:59:59.999）
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 7); 
                    endOfWeek.setHours(11, 59, 59, 999); 
                    return {
                        StartTime: startOfWeek,
                        EndTime: endOfWeek,
                    };
                }
                break;
            case "5":
                //上月

                {
                    // 獲取今天的日期
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // 將時間設置為今天的00:00

                    // 計算上個月的開始時間（上個月的第一天的00:00）
                    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1); // 上個月的第一天
                    startOfLastMonth.setHours(12, 0, 0, 0); // 將時間設置為00:00

                    // 計算這個月的第一天
                    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    endOfLastMonth.setHours(11, 59, 59, 999); 
                    return {
                        StartTime: startOfLastMonth,
                        EndTime: endOfLastMonth,
                    };

                }
                break;
            case "6":
                //本月
                {
                    // 獲取今天的日期
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // 將時間設置為今天的00:00

                    // 計算本月的開始時間（本月的第一天的00:00）
                    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // 本月的第一天
                    startOfMonth.setHours(12, 0, 0, 0); // 將時間設置為00:00

                    // 計算本月的結束時間（本月的最後一天的23:59:59.999）
                    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
                    endOfMonth.setHours(11, 59, 59, 999); // 將時間設置為23:59:59.999
                    return {
                        StartTime: startOfMonth,
                        EndTime: endOfMonth,
                    };

                }
                break;

        }
    }
    /**
 * 將字串中的 <br/> 標籤替換為換行符號 \n
 * @param input 字串
 * @returns 替換後的字串
 */
    static replaceBrWithNewline(input: string): string {
        return input.replace(/<br\s*\/?>/gi, '\n');
    }


    static getAnimationTimeByName(name: string, SkeletonObj: sp.Skeleton) {
        const state = SkeletonObj.getState();

        if (state == undefined) throw `[ERROR SPINE ANIMATION] 無法取得取得動畫狀態>`;
        const { animations } = state.data.skeletonData;
        let result = 0;
        for (const key in animations) {
            if (Object.prototype.hasOwnProperty.call(animations, key)) {
                const element = animations[key];
                if (element.name == name) {
                    result = element.duration;
                }
            }
        }

        return result;
    }
    static GetSelectedToggle(toggleContainer: ToggleContainer): Toggle[] | null {
        let arr: Toggle[] = []
        if (toggleContainer) {
            for (const toggle of toggleContainer.toggleItems) {
                if (toggle.isChecked) {

                    arr.push(toggle);
                }
            }
        }
        return null;
    }
    static NickName(name) {
        let str = "";
        let myNum = name.toString().split("");
        if (myNum.length > 6) {
            for (let i = 0; i < 6; i++) {
                str += myNum[i];
            }
            str += "...";
        } else {
            for (let i = 0; i < myNum.length; i++) {
                str += myNum[i];
            }
        }
        return str;
    }
    static truncateTextToFit(label: Label, text: string, maxWidth: number): string {
        const originalString = label.string;
        label.string = text;
        const uiTransform = label.getComponent(UITransform);
        let textWidth = uiTransform.width;

        if (textWidth <= maxWidth) {
            return text;
        }

        let truncatedText = text;
        while (textWidth > maxWidth && truncatedText.length > 0) {
            truncatedText = truncatedText.slice(0, -1);
            label.string = truncatedText + '...';
            textWidth = uiTransform.width;
        }

        label.string = originalString; // 恢復原始文本
        return truncatedText + '...';
    }
    static NumberToFixed(point, dotNum = 2): string {
        // 將數值轉換為小數點後 dotNum 位的字串
        let formattedPoint = point.toFixed(dotNum);
        // 移除小數點後多餘的零
        if (formattedPoint.includes('.')) {
            formattedPoint = formattedPoint.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
        }
        return formattedPoint;
    }
    SetTextBoundingBox(txtlab: Label) {
        // 假設你已經有一個 label 節點
        let label = txtlab

        // 更新渲染數據以確保獲得準確的邊界尺寸
        // 獲取 Label 節點的尺寸
        let labelOldSize = label.node.getComponent(UITransform).contentSize
        label.overflow = Label.Overflow.NONE;
        label.updateRenderData(true);




    }
    static NumberCommaBase(num) {
        let myNum = num;
        let isCut = false;
        if (num < 0) {
            myNum = Math.abs(num);
            isCut = true;
        }
        myNum = myNum.toString().split(".");  // 分隔小數點
        let arr = myNum[0].split("").reverse();  // 轉換成字符數組並且倒序排列
        let res: string[] = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            if (i % 3 === 0 && i !== 0) {
                //res.push(",");   // 添加分隔符
            }
            res.push(arr[i]);
        }
        res.reverse(); // 再次倒序成為正確的順序
        let res_1;
        if (myNum[1]) {  // 如果有小數的話添加小數部分
            res_1 = res.join("").concat("." + myNum[1]);
        } else {
            res_1 = res.join("");
        }
        if (isCut) {
            res_1 = "-" + res_1;
        } else {
            res_1 = "+" + res_1;
        }
        return res_1;
    }
    /**
 * 分幀執行 Generator 邏輯
 *
 * @param generator 生成器
 * @param duration 持續時間（毫秒），每次執行 Generator 的操作時，最長可持續執行時長。假設值為8毫秒，那麼表示1幀（總共16毫秒）下，分出8毫秒時間給此邏輯執行
 */
    static executePreFrame(generator: Generator, duration: number, Component: Component) {
        return new Promise<void>((resolve, reject) => {
            let gen = generator;
            // 創建執行函數
            let execute = () => {
                // 執行之前，先記錄開始時間
                let startTime = new Date().getTime();
                // 然後一直從 Generator 中獲取已經拆分好的代碼段出來執行
                for (let iter = gen.next(); ; iter = gen.next()) {
                    // 判斷是否已經執行完所有 Generator 的小代碼段，如果是的話，那麼就表示任務完成
                    if (iter == null || iter.done) {
                        resolve();
                        return;
                    }
                    // 每執行完一段小代碼段，都檢查一下是否已經超過我們分配的本幀，這些小代碼段的最大可執行時間
                    if (new Date().getTime() - startTime > duration) {
                        // 如果超過了，那麼本幀就不再執行，開定時器，讓下一幀再執行
                        Component.scheduleOnce(() => {
                            execute();
                        });
                        return;
                    }
                }
            };
            // 運行執行函數
            execute();
        });
    }
    static NumAnim(T: Node, move: number, second: number = 0.8) {
        T.active = true;
        new Tween(T)
            .to(second, {
                position: new Vec3(T.getPosition().x, T.getPosition().y + move, 0)
            })
            .delay(0.1)
            .call(() => {
                T.active = false;
                T.setPosition(T.getPosition().x, T.getPosition().y - move, 0);
            })
            .start()
    }
    static NumAnimWait(T: Node, move: number, second: number = 0.8) {
        T.active = true;
        if (second == -1) {
            T.setPosition(T.getPosition().x, T.getPosition().y + move)
        } else {
            new Tween(T)
                .to(second, {
                    position: new Vec3(T.getPosition().x, T.getPosition().y + move, 0)
                })

                .start()
        }

    }
    static isNumber(value: string): boolean {
        // 檢查值是否為數字
        return !isNaN(Number(value));
    }
    /**

 * 載入圖片

 * @param url 圖片連結

 * @param imgId 自定義圖片ID

 * @param fun 回調（圖片ID,圖片SpriteFrame）

 * @returns

 */


    public static getDateStr(time: any) {

        var date = new Date(time);

        var y = date.getFullYear();

        var m = date.getMonth() + 1;

        var d = date.getDate();

        var h = date.getHours();

        var mm = date.getMinutes();

        var s = date.getSeconds();

        return js.formatStr("%s-%s-%s %s:%s:%s", y, m, d, h, mm, s);

    }

    // 將 Map 轉換為物件
    public static mapToObject(map) {
        let obj = Object.create(null);
        map.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }
    // 複製到系統剪切板
    public static webCopyString(str: string, cb?: Function) {
        var input = str + '';
        const el = document.createElement('textarea');
        el.value = input;
        el.setAttribute('readonly', '');
        // el.style.contain = 'strict';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.fontSize = '12pt'; // 防止在 iOS 上縮放
        const selection = getSelection()!;
        var originalRange = null;
        if (selection.rangeCount > 0) {
            originalRange = selection.getRangeAt(0);
        }
        document.body.appendChild(el);
        el.select();
        el.selectionStart = 0;
        el.selectionEnd = input.length;
        var success = false;
        try {
            success = document.execCommand('copy');
        }
        catch (err) {
        }
        document.body.removeChild(el);
        if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }
        cb && cb(success);
        if (success) {
            console.log("複製成功");
        }
        else {
            console.log("複製失敗");
        }
        return success;
    }

}

