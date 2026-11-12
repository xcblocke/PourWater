
// DyRecorderManager.ts
interface RMStartOptions {
    /** 录屏的时长，单位 s，必须大于 3s，最大值 300s（5 分钟）。 */
    duration?: number;
    /** 是否添加水印，会在录制出来的视频上添加默认水印，目前不支持自定义水印图案。 */
    isMarkOpen?: boolean;
    /** 水印距离屏幕上边界的位置，单位为 dp。 */
    locTop?: number;
    /** 水印距离屏幕左边界的位置，单位为 dp。 */
    locLeft?: number;
    /** 设置录屏帧率，对于性能较差的手机可以调低参数以降低录屏性能消耗。 */
    frameRate?: number;

}

interface SystemInfoOptions {
    /** 接口调用成功的回调函数 */
    success?: Function
    /** 接口调用失败的回调函数 */
    fail?: Function
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: Function
}

interface SystemInfo {
    /** 操作系统版本 */
    system: string;
    /** 操作系统类型 */
    platform: string;
    /** 手机品牌 */
    brand: string;
    /** 手机型号 */
    model: string;
    /** 宿主 App 版本号（宿主指今日头条、抖音等） */
    version: string;
    /** 宿主 APP 名称 */
    appName: string;
    /** 客户端基础库版本 */
    SDKVersion: string;
    /** 屏幕宽度 */
    screenWidth: number;
    /** 屏幕高度 */
    screenHeight: number;
    /** 可使用窗口宽度 */
    windowWidth: number;
    /** 可使用窗口高度 */
    windowHeight: number;
    /** 设备像素比 */
    pixelRatio: number;
    /** 在竖屏正方向下的安全区域 */
    safeArea: Object;
    /** 机型性能评分 */
    deviceScore: Object;
}

interface MarkInfo {
    /** 水印的宽度 */
    markWidth: number;
    /** 水印的高度 */
    markHeight: number;
}
export class DyRecorderManager {
    static _ins: DyRecorderManager;
    public tt = window["tt"];
    private getGameRecorderManager
    public systemInfo: SystemInfo;
    private maskInfo: MarkInfo;
    static get ins() {
        if (this._ins) {
            return this._ins;
        }
        this._ins = new DyRecorderManager();
        this._ins.init();

        return this._ins;
    }

    init() {
        if (!this.tt) return
        this.systemInfo = this.tt.getSystemInfoSync();

        this.getGameRecorderManager = this.tt.getGameRecorderManager()
        this.maskInfo = this.getGameRecorderManager.getMark();

        this.onError()

    }

    start(options: RMStartOptions = {
        duration: 30,
        isMarkOpen: true,
    }) {
        if (!this.tt) return
        var x = (this.systemInfo.screenWidth - this.maskInfo.markWidth) / 2;
        var y = (this.systemInfo.screenHeight - this.maskInfo.markHeight) / 2;
        options.locLeft ??= x
        options.locTop ??= y
        this.onStart()
        //添加水印并且居中处理
        this.getGameRecorderManager.start(options);
    }
    async stop() {
        if (!this.tt) return
        const videoPath = this.onStop()
        this.getGameRecorderManager.stop();
        return videoPath
    }
    private onStart() {
        this.getGameRecorderManager.onStart((res) => {
            console.log(res, "录屏开始");
            // do something;
        });
    }
    private onStop() {
        return new Promise<void>((resolve, reject) => {
            this.getGameRecorderManager.onStop((res) => {
                console.log(res, res.videoPath, '录屏结束');
                resolve(res.videoPath)
                // do something;
            });
        })

    }
    private onError() {
        this.getGameRecorderManager.onError((err) => {
            console.log(err, '录屏失败');

            // do something;
        })
    }
}

