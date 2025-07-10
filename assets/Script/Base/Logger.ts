import { error, log } from "cc";
import { LogLevel } from "./LogLevel";
import * as pako from 'pako';
import { Buffer } from 'buffer';
export default class Logger {
    private static logQueue: any[] = [];
    private static specialLogQueue: any[] = [];

    private static currentBatchSize = 100; // 初始批次大小
    private static readonly MAX_QUEUE_LENGTH = 500;
    private static LOG_INTERVAL = 30000; // 初始值為 30 秒
    private static logIntervalTimer: number | null = null;
    public static serverLogUrl: string = "https://gamelog.apgame001.win/save.php";
    public static serverLogPakoUrl: string = "https://gamelog.apgame001.win/saveZ.php";
    public static serverLogPakoV2Url: string = "https://gamelog.apgame001.win/saveZV2.php";
    public static logLevel = LogLevel.INFO;
    private static readonly NORMAL_LOG_KEY = 'pendingNormalLogs';
    private static readonly SPECIAL_LOG_KEY = 'pendingSpecialLogs';
    
    static init() {

        this.scheduleNextLogSend();

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // 頁面變為可見時,立即嘗試發送積累的日誌
                Logger.sendLogs();
                Logger.sendSpecialLogs();
            }
        });
        window.addEventListener('online', () => {
            Logger.sendLogs();
            Logger.sendSpecialLogs();
        });
    }
    private static isOnline(): boolean {
        return navigator.onLine;
    }
    public static decompressLog(compressedLog: Uint8Array): string {
        return pako.inflate(compressedLog, { to: 'string' });
    }


    private static scheduleNextLogSend() {
        if (this.logIntervalTimer !== null) {
            clearTimeout(this.logIntervalTimer);
        }
        this.logIntervalTimer = setTimeout(() => {
            if (this.isOnline()) {
                this.sendLogs();
                this.sendSpecialLogs();
            }
            this.scheduleNextLogSend();
        }, this.LOG_INTERVAL);
    }


    static addLog(message: string, level: LogLevel) {
        const logMessage = message + '\n\n';
        if (this.logLevel > level) return;

        const queue = level >= LogLevel.WARNING ? this.specialLogQueue : this.logQueue;
        queue.push(logMessage);

        // 限制隊列大小
        if (queue.length > this.MAX_QUEUE_LENGTH) {
            queue.shift(); // 移除最舊的日誌
        }
    }

    static error(message: string) {
        error(message);
    }
    private static sendLogs() {
        this.sendLogsToServer(this.NORMAL_LOG_KEY, 'mi');
    }

    static sendSpecialLogs() {
        this.sendLogsToServer(this.SPECIAL_LOG_KEY, 'mi_special');
    }

    private static async sendLogsToServer(key: string, prefix: string) {
        const currentQueue = key === this.NORMAL_LOG_KEY ? this.logQueue : this.specialLogQueue;
        if (currentQueue.length === 0) return;

        const logsToSend = currentQueue.splice(0, this.currentBatchSize);
        const fileName = `${prefix}_${this.generateTimestamp()}_${globalThis.MemberId}`;

        try {
            await this.sendLogToServergzip(logsToSend, fileName);
        } catch (error) {
           
            // 發送失敗時，清空整個隊列
            currentQueue.length = 0;

        }
    }

    private static generateTimestamp(): string {
        const date = new Date();
        return `${date.getFullYear()}:${this.padZero(date.getMonth() + 1)}:${this.padZero(date.getDate())}_${this.padZero(date.getHours())}:${this.padZero(date.getMinutes())}:${this.padZero(date.getSeconds())}.${this.padZeroMilliseconds(date.getMilliseconds())}`;
    }

    static padZero(value: number): string {
        return value < 10 ? `0${value}` : `${value}`;
    }

    static padZeroMilliseconds(value: number): string {
        return value < 10 ? `00${value}` : value < 100 ? `0${value}` : `${value}`;
    }

    private static async sendLogToServer(logs: any[], fileName: string): Promise<void> {


        const logData = logs.map(log => {
            if (typeof log === 'string') {
                return log.replace(/\n/g, '\r\n');
            } else if (typeof log === 'object') {
                return JSON.stringify(log).replace(/\n/g, '\r\n');
            } else {
                return String(log).replace(/\n/g, '\r\n');
            }
        }).join('\n');

        const formData = new URLSearchParams();
        formData.append('logs', logData);
        formData.append('fileName', fileName);

        const response = await fetch(this.serverLogUrl, {
            method: 'POST',
            body: formData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            keepalive: true
        });

        if (!response.ok) {
            throw new Error(`HTTP 錯誤！狀態: ${response.status}`);
        }


      

    }
    private static async sendLogToServergzip(logs: any[], fileName: string): Promise<void> {
        try {
            // 優化日誌數據格式
            const logData = logs.map(log => {
                if (typeof log === 'string') {
                    return log.replace(/\n/g, '\r\n').trim();
                } else if (typeof log === 'object') {
                    // 移除不必要的空格和格式化
                    return JSON.stringify(log, null, 0).replace(/\n/g, '\r\n').trim();
                } else {
                    return String(log).replace(/\n/g, '\r\n').trim();
                }
            }).join('\n');

         
            const compressedData = pako.gzip(logData);
           

            const blob = new Blob([compressedData], { type: 'application/gzip' });
            const actualFileSizeKB = (blob.size / 1024).toFixed(2);
          

            const formData = new FormData();
            formData.append('logs', blob, 'logs.gz');
            formData.append('fileName', fileName);

            // 檢查 URL
            if (!this.serverLogPakoUrl.startsWith('http')) {
                throw new Error('無效的 URL 格式');
            }

            // 修改 fetch 配置
            const response = await fetch(this.serverLogPakoUrl, {
                method: 'POST',
                body: formData,
                mode: 'cors',
                headers: {
                    // 移除所有自定義 headers，讓瀏覽器自動處理
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP 錯誤！狀態: ${response.status}, 回應: ${errorText}`);
            }

            const responseData = await response.text();


        } catch (error) {
          

            // 更詳細的錯誤診斷
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
            
            }

            throw error;
        }
    }
}

// 初始化日誌系統
Logger.init();