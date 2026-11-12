/**
 * 基础视图类，所有视图类都应该继承自此类
 */
import { Global } from "../Global";
import { AdMgr } from "../ad/AdMgr";
import { Clips } from "../enum/Enums";
import { AudioMgr } from "../manager/AudioMgr";
import { PoolMgr } from "../manager/PoolMgr";
import { Tools } from "../utils/Tools";

const { ccclass, property } = cc._decorator;
// @ts-ignore
let old: Function = cc.Button.prototype._onTouchEnded;
// @ts-ignore
cc.Button.prototype._onTouchEnded = function (...args) {

  old.apply(this, args);
  AudioMgr.ins.playSound(Clips.Button_Click, 0.5);
}
@ccclass
export default class BaseView extends cc.Component {
  // 是否在开始时显示横幅广告
  @property({
    tooltip: "在开始时显示横幅广告",
  })
  showBannerAd = false;

  // 显示横幅广告的延迟时间
  @property({
    visible() {
      return this.showBannerAd;
    },
    range: [0, 5],
  })
  bannerDelay = 0;

  // 是否在关闭时隐藏横幅广告
  @property({
    visible() {
      return this.showBannerAd;
    },
    tooltip: "在关闭时隐藏横幅广告",
  })
  hideBannerOnClose = true;

  // 是否在小屏幕上显示
  @property({
    visible() {
      return this.showBannerAd;
    },
  })
  displayinSmallscreen = true;

  // 是否在开始时显示插页式广告
  @property({
    tooltip: "在开始时显示插页式广告",
  })
  showIntersitialAd = false;

  // 显示插页式广告的延迟时间
  @property({
    visible() {
      return this.showIntersitialAd;
    },
    range: [0, 5],
  })
  intersitialDelay = 0;

  // 是否在开始时显示视频广告
  @property({
    tooltip: "在开始时显示视频广告",
  })
  showVideoAd = false;

  // 是否在开始时显示网格广告
  @property({
    tooltip: "在开始时显示网格广告",
  })
  showGridAd = false;

  // 显示视频广告的延迟时间
  @property({
    visible() {
      return this.showVideoAd;
    },
    range: [0, 5],
  })
  videoDelay = 0;

  // 是否缓动视图
  @property({})
  tweenView = true;

  // 缓动的根节点
  @property({
    type: cc.Node,
    visible() {
      return this.tweenView;
    },
  })
  root: cc.Node = null;

  // 缓动的时间
  @property({
    visible() {
      return this.tweenView;
    },
  })
  tweenTime = 0.25;

  // 是否播放按钮音效
  @property({})
  playBtnClip = true;

  /**
   * 显示广告
   */
  showAds() {
    console.log(this.showBannerAd, this.showIntersitialAd, this.showVideoAd, this.showGridAd, '广告');

    if (this.showBannerAd) {
      // 如果不在小屏幕上显示广告，则跳过
      // if (!this.displayinSmallscreen && Global.screenRatio <= 1.1) return;
      // 延迟一定时间后显示 Banner 广告
      this.scheduleOnce(() => {
        this.showBanner();
      }, this.bannerDelay);
    }
    if (this.showIntersitialAd) {
      // 延迟一定时间后显示插屏广告
      this.scheduleOnce(() => {
        this.showIntersitial();
      }, this.intersitialDelay);
    }
    if (this.showVideoAd) {
      // 延迟一定时间后显示视频广告
      this.scheduleOnce(() => {
        this.showVideo();
      }, this.bannerDelay);
    }
    if (this.showGridAd) {
      // 延迟一定时间后显示自定义广告
      this.scheduleOnce(() => {
        this.showCustomAd();
      }, this.bannerDelay);
    }
  }

  /**
   * 关闭广告
   */
  closeAd() {
    AdMgr.closeAd();
  }

  /**
   * 显示自定义广告
   * @param CB 回调函数
   */
  showCustomAd(CB = () => { }) {
    AdMgr.showCustomAd(CB);
  }

  /**
   * 显示 Banner 广告
   */
  showBanner() {
    AdMgr.showBanner();
  }

  /**
   * 显示视频广告
   * @param CB 回调函数
   */
  showVideo(CB = null) {
    // TODO: 记得换成看广告的
    AdMgr.showVideo(CB);
  }

  /**
   * 显示插屏广告
   */
  showIntersitial() {
    AdMgr.showInterstial(this.bannerDelay);
  }

  /**
   * 分享
   * @param CB 回调函数
   */
  share(CB = null) {
    console.log("分享");
    AdMgr.shareFn(CB);
  }

  /**
 * 分享
 * @param CB 回调函数
 */
  shareVideo(videoPath, CB = null) {
    console.log("视频分享");
    AdMgr.shareVideoFn(videoPath, CB);
  }

  onDisable() {
    if (this.hideBannerOnClose) {
      this.closeAd();
    }
  }
  onLoad() {

  }
  /**
   * 当组件启用时调用
   */
  onEnable() {
    this.playBtnClip && AudioMgr.ins.playSound(Clips.Button_Click, 0.5);

    if (this.tweenView) {
      if (!this.root) {
        this.root = this.node;
        this.scheduleOnce(() => {
          Tools.fadeIn(this.root);
        })
      } else {
        Tools.fadeIn(this.root);
      }

    }
    this.showAds();
    this.schedule(() => {
      this.closeAd()
      this.showAds()
    }, 1)
  }

  /**
   * 关闭视图
   */
  close() {
    // 播放按钮音效
    this.playBtnClip && AudioMgr.ins.playSound(Clips.Button_Click, 0.5);
    // 如果显示了 Banner 广告，则关闭广告
    if (this.showBannerAd) this.closeAd();
    // 如果开启了 tweenView，则执行淡出动画
    if (this.tweenView) {
      if (!this.root) this.root = this.node;
      // Tools.fadeOut(this.root, () => {
      //   PoolMgr.ins.putNode(this.node);
      // });
    } else {
      PoolMgr.ins.putNode(this.node);
    }
  }
}
