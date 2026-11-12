import Main from "../manager/Main";

export class DyPlatform {

    static _ins: DyPlatform;
    public tt = window["tt"];
    public haveSideReward = false

    openToScence() {
        if (!this.tt) return
        this.tt.navigateToScene({
            scene: 'sidebar',
            fail: console.log,
            success: console.log
        })
    }

    static get ins() {
        if (this._ins) {
            return this._ins;
        }

        this._ins = new DyPlatform();

        this._ins.init();



        return this._ins;
    }

    init() {
        // 绑定分享参数

        const shares = Main.ins.Shares[0].sharePics;


        if (shares.length > 0 && this.tt) {
            this.tt.onShareAppMessage(function () {
                // 用户点击了“转发”按钮
                let url = Math.floor(Math.random() * shares.length);

                return {
                    title: shares[url].shareText,
                    templateId: shares[url].shareId, // 图片 id
                    imageUrl: shares[url].shareLink // 图片 URL
                }
            })
            // 4. 监听分享成功
            this.tt.showShareMenu({
                withShareTicket: true,
            });

            // this.tt.onShareTimeline(() => {
            //     let url = Math.floor(Math.random() * shares.length);
            //     return {
            //         title: shares[url].shareText,
            //         imageUrl: shares[url].shareLink, // 图片 URL
            //         query: ''
            //     }
            // })

        }

        if (!this.tt) {
            this.haveSideReward = true
            return
        }
        this.tt.onShow(op => {
            const obj = {
                launch_from: "homepage",
                location: "sidebar_card",
                scene: "021036"
            }
            let flag = false
            for (let key in obj) {
                if (op[key] !== obj[key]) flag = true
            }
            if (!flag) this.haveSideReward = true
            console.log(op, 'op');
        });

    }

    getLaunchOption() {
        const query = this.tt.getLaunchOptionsSync().query;

        return query;
    }

    getScene() {
        let scene = this.tt.getLaunchOptionsSync().scene;
        return scene
    }

    showShare(queryString: string = '', callback?: Function) {

        if (!Main.ins.Shares[0]) return;

        const shares = Main.ins.Shares[0].sharePics;

        if (shares.length <= 0) return;

        let url = Math.floor(Math.random() * shares.length);

        if (this.tt) {
            this.tt.shareAppMessage({
                channel: 'article', // 分享渠道，可选值：video、article
                // channel: Math.random() > 0.5 ? 'video' : 'article', // 分享渠道，可选值：video、article
                title: shares[url].shareText,
                templateId: shares[url].shareId, // 图片 id
                imageUrl: shares[url].shareLink, // 图片 URL
                query: queryString,
                success: () => {
                    console.log('分享成功')
                    callback(1)
                },
                fail: () => {
                    console.log('分享失败')
                    callback(0)
                }
            })

        }

    }
    videoShare(videoPath: string, queryString: string = '', callback?: Function) {

        if (!Main.ins.ShareVideoes[0]) return;

        const shares = Main.ins.ShareVideoes[0].sharePics;

        if (shares.length <= 0) return;

        let url = Math.floor(Math.random() * shares.length);
        console.log(url, queryString, shares);

        if (!this.tt) return
        this.tt.shareAppMessage({
            channel: "video",
            query: queryString,
            templateId: shares[url].shareId, // 图片 id
            title: shares[url].title,
            desc: shares[url].desc,
            extra: {
                videoPath, // 可用录屏得到的本地文件路径
                videoTopics: shares[url].videoTopics,
                hashtag_list: shares[url].videoTopics,
            },
            success() {
                console.log("分享视频成功");
                callback(1)
            },
            fail(e) {
                console.log("分享视频失败");
                callback(0)
            },
        });
    }
    //#region  banner
    banner: any;

    hideBanner() {

        if (this.banner != null) {

            this.banner.destroy();
            this.banner = null;

        }
    }

    showBanner(style = 2) {

        if (!this.tt) {
            return;
        }

        if (this.banner != null) {
            this.banner.destroy();
            this.banner = null;
            return;

        }

        let id = Main.ins.Platforms[0].bannerId[0];

        let winSize = this.tt.getSystemInfoSync();

        console.log(id, 'id');
        const targetBannerAdWidth = 300;
        let bannerAd = this.tt.createBannerAd({


            adUnitId: id,

            adIntervals: 30,


            style: {

                // left: 0,

                // top: winSize.windowHeight - (targetBannerAdWidth / 16) * 9,
                top: winSize.windowHeight,
                width: targetBannerAdWidth,

            }

        })
        console.log(bannerAd, 'bannerAd');
        // 也可以手动修改属性以调整广告尺寸
        bannerAd.style.left = (winSize.windowWidth - targetBannerAdWidth) / 2;
        bannerAd.onResize(size => {
            bannerAd.style.top = winSize.windowHeight - size.height / 2+20;
            bannerAd.style.left = (winSize.windowWidth - size.width) / 2;

        })
        let left;
        if (style == 1) {
            left = winSize.windowWidth - bannerAd.style.width;
        }
        else if (style == 2) {
            left = winSize.windowWidth / 2 - bannerAd.style.width / 2;
        }
        else {
            left = 0;
        }


        bannerAd.onLoad(() => {

            console.log('banner 广告加载成功');

            this.banner = bannerAd;
            bannerAd.show();

        })

        bannerAd.onError(err => {

            console.log('banner 广告加载错误', err);

        })


    }
    //#endregion


    //#region 激励
    rewardVideo2: any;
    rewardVideoList = new Map<string, number>()
    showRewardVideo(callback?: Function) {
        var fun = function (res) {
            if (res && res.isEnded) {
                console.log('res:  ', res);
                callback(1);
                rewardedVideoAd.offClose(fun);
            } else {
                console.log('播放中途退出');
                rewardedVideoAd.offClose(fun);
                callback(0);
            }
        }
        let my = this;
        let id = Main.ins.Platforms[0].videoId[0];
        if (my.rewardVideo2 != null) {
            my.rewardVideo2.offClose(fun);
        }
        let rewardedVideoAd = this.tt.createRewardedVideoAd({
            adUnitId: id,
        });
        my.rewardVideo2 = rewardedVideoAd;
        rewardedVideoAd.load().then(() => {
            this.tt.showToast({

                title: "加载中，请稍后",

                icon: 'success',//图标，支持"success"、"loading" 

                duration: 1500,//提示的延迟时间，单位毫秒，默认：1500 

                success: function () { },

                fail: function () { },

                complete: function () { }

            })


            console.log('激励视频 广告加载成功');
            rewardedVideoAd.show().then(() => {
                rewardedVideoAd.onClose(fun);

            })
        });
        let showToastState = false
        rewardedVideoAd.onError(err => {
            console.log('激励视频 广告显示失败', err);
            if (!showToastState) {
                showToastState = true
            } else {
                return
            }
            this.tt.showToast({

                title: "请稍后再试",

                icon: 'fail',//图标，支持"success"、"loading" 

                duration: 1500,//提示的延迟时间，单位毫秒，默认：1500 

                success: function () { },

                fail: function () { },

                complete: function () { }

            })
            callback(2);
        })

    }
    //#endregion

    // #region 插屏
    showInterstitialAd(delay = 0) {
        if (!this.tt) {
            return;
        }
        let id = Main.ins.Platforms[0].intersitialId[0];
        let interstitialAd = this.tt.createInterstitialAd({
            adUnitId: id,
        });
        if (interstitialAd) {
            interstitialAd.load().then(() => {
                console.log('插屏 广告加载成功');
            });
            interstitialAd.onClose(res => {
                console.log('关闭插屏广告', res);
            });
            interstitialAd.onError(err => {
                console.log('err:插屏广告加载失败', err);
            });

            setTimeout(() => {
                interstitialAd.show().catch((err) => {
                    console.log('插屏广告展示失败', err);
                });
            }, delay * 1000);
        }

    }
    //#endregion

    //创建原生模板广告组件-1行格子广告-弹窗
    custom: any;
    showCustomAd(callback: Function) {

        callback(0)
    }

    // 隐藏原生模板广告组件
    hideCustomAd() {
        if (this.custom) {
            // this.custom.hide();
            this.custom = null;
        }
    }
}