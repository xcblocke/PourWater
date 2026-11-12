
import { events, ui } from '../enum/Enums';
import { Global } from '../Global';
import ResMgr from '../manager/ResMgr';
import { DyPlatform } from './DyPlatform';
import { QQPlatform } from './QQPlatform';
import { WxPlatform } from './WxPlatform';

export class AdMgr {

    static bannerOn = false;
    static customOn = false;

    static closeAd() {
        const system = cc.sys.platform;

        switch (system) {

            case cc.sys.WECHAT_GAME:
                if (window['qq']) {
                    QQPlatform.ins.hideBanner();
                    QQPlatform.ins.hideCustomAd();
                    this.bannerOn = false;
                    this.customOn = false;
                    return
                }
                WxPlatform.ins.hideBanner();
                WxPlatform.ins.hideCustomAd();
                this.bannerOn = false;
                this.customOn = false;
                break;
            case cc.sys.BYTEDANCE_GAME:
                DyPlatform.ins.hideBanner();
                DyPlatform.ins.hideCustomAd();
                this.bannerOn = false;
                this.customOn = false;
                break;
            case cc.sys.ANDROID:

                break;
        }
    }



    static showBanner() {
        const system = cc.sys.platform;

        switch (system) {

            case cc.sys.WECHAT_GAME:
                // if (window['qq']) {
                //     if (!this.bannerOn)
                //         QQPlatform.ins.showBanner();
                //     return
                // }

                if (!this.bannerOn)
                    (window['qq']?QQPlatform:WxPlatform).ins.showBanner();

                break;
            case cc.sys.BYTEDANCE_GAME:
                // if (!this.bannerOn)
                //     DyPlatform.ins.showBanner();
                break;
            case cc.sys.ANDROID:

                break;
        }

    }
    static showInterstial(delay = 0) {

        const system = cc.sys.platform;

        switch (system) {

            case cc.sys.WECHAT_GAME:
                if (window['qq']) {
                    QQPlatform.ins.showInterstitialAd(delay);
                    return
                }
                WxPlatform.ins.showInterstitialAd(delay);
                break;
            case cc.sys.MOBILE_BROWSER:
            case cc.sys.DESKTOP_BROWSER:
                break;

            case cc.sys.BYTEDANCE_GAME:
                DyPlatform.ins.showInterstitialAd(delay);

                break;
            case cc.sys.ANDROID:

                break;
        }

    }
    static showCustomAd(CB: Function) {
        const system = cc.sys.platform;

        switch (system) {

            case cc.sys.WECHAT_GAME:
                if (window['qq']) {
                    if (!this.customOn)
                        QQPlatform.ins.showCustomAd(CB);
                    return
                }
                if (!this.customOn)
                    WxPlatform.ins.showCustomAd(CB);
                break;
            case cc.sys.BYTEDANCE_GAME:
                if (!this.customOn)
                    DyPlatform.ins.showCustomAd(CB);
                break;
            case cc.sys.ANDROID:

                break;
        }
    }
    static showVideo(CB = null) {
        // console.log(CB);
        const keys = []
        const key = Symbol("showVideo");
        if (CC_DEBUG) {
            CB && CB();
            return;
        }


        const system = cc.sys.platform;

        switch (system) {
            case cc.sys.MOBILE_BROWSER:
            case cc.sys.DESKTOP_BROWSER:
                CB && CB();
                break;

            case cc.sys.WECHAT_GAME:
                /* ads here!! */
                Global.Pause();
                if (window['qq']) {
                    QQPlatform.ins.showRewardVideo((data) => {
                        // console.log(data);

                        //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
                        if (data == 1) {
                            CB && CB();
                            Global.Pause(false);
                            cc.director.emit(events.Toast, "获取奖励成功");
                        } else if (data == 2) {
                            Global.Pause(false);
                            if (Global.enableShareAd) {

                                cc.director.emit(events.Toast, "暂无广告，分享可以获得奖励喔");
                                this.shareFn(CB)

                            } else {
                                Global.Pause(false);

                                cc.director.emit(events.Toast, "获取奖励失败");

                            }
                        } else {
                            Global.Pause(false);
                            cc.director.emit(events.Toast, "获取奖励失败");
                        }

                    })
                    return
                }

                WxPlatform.ins.showRewardVideo((data) => {
                    // console.log(data);

                    //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
                    if (data == 1) {
                        CB && CB();
                        Global.Pause(false);
                        cc.director.emit(events.Toast, "获取奖励成功");
                    } else if (data == 2) {
                        Global.Pause(false);
                        if (Global.enableShareAd) {

                            cc.director.emit(events.Toast, "暂无广告，分享可以获得奖励喔");
                            this.shareFn(CB)

                        } else {
                            Global.Pause(false);

                            cc.director.emit(events.Toast, "获取奖励失败");

                        }
                    } else {
                        Global.Pause(false);
                        cc.director.emit(events.Toast, "获取奖励失败");
                    }

                })
                break;
            case cc.sys.BYTEDANCE_GAME:
                Global.Pause();
                DyPlatform.ins.showRewardVideo((data) => {
                    // console.log(data, '广告广告广告广告');
                    //通过data判断激励视频广告是否加载成功、失败；判断是否中途退出还是完整播放
                    if (data == 1) {
                        if (keys.includes(key)) {
                            return
                        }
                        CB && CB();
                        Global.Pause(false);
                        cc.director.emit(events.Toast, "获取奖励成功");
                    } else if (data == 2) {
                        Global.Pause(false);
                        if (Global.enableShareAd) {
                            cc.director.emit(events.Toast, "暂无广告，分享可以获得奖励喔");
                            this.shareFn(CB)
                        } else {
                            Global.Pause(false);

                            cc.director.emit(events.Toast, "获取奖励失败");


                        }
                        keys.push(key);
                    } else {
                        Global.Pause(false);
                        cc.director.emit(events.Toast, "获取奖励失败");
                        keys.push(key);

                    }

                })
                break;
            case cc.sys.ANDROID:

                break;
        }

    }

    static shareFn(CB) {
        if (!window["wx"] && !window["tt"]) {
            CB()
            return
        }
        if (window["tt"]) {
            DyPlatform.ins.showShare('', (data) => {
                if (data) {
                    CB && CB();
                }
            });
            return
        }
        if (window["wx"]) {
            // if (window['qq']) {
            //     setTimeout(() => {

            //         QQPlatform.ins.showShare();

            //         setTimeout(() => {
            //             CB && CB();

            //         }, 1500);

            //     }, 500);
            //     return
            // }
            setTimeout(() => {

                (window['qq'] ? QQPlatform : WxPlatform).ins.showShare();

                setTimeout(() => {
                    CB && CB();

                }, 1500);

            }, 500);
        }


    }
    static shareVideoFn(videoPath, CB) {
        if (!window["wx"] && !window["tt"]) {
            CB()
            return
        }
        if (window["tt"]) {
            DyPlatform.ins.videoShare(videoPath, '', (data) => {
                if (data) {
                    CB && CB();
                }
            });

        }


    }
    showCustomAd(callback: Function) {
        callback(0)
    }
}

