/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-07-19 20:45:49
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-10-21 21:59:37
 * @FilePath: \倒水游戏重构\assets\scripts\manager\Main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Global } from "../Global";
import { Assets, Key, adConfig, events, shareConfig, shareVideoConfig, ui } from "../enum/Enums";
import { Tools, load } from "../utils/Tools";
import ResMgr from "./ResMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
  // LIFE-CYCLE CALLBACKS:

  /** 最大关卡 */
  @property({ type: cc.Integer, tooltip: "最大关卡" })
  maxLevel = 999;

  /** 当前关卡 */
  @property({ type: cc.Integer, tooltip: "当前关卡" })
  currentLevel = 5;

  /** 广告配置 */
  @property({ type: adConfig, tooltip: "广告配置" })
  Platforms: adConfig[] = [];

  /** 分享配置 */
  @property({ type: shareConfig, tooltip: "分享配置" })
  Shares: shareConfig[] = [];
  /** 分享配置 */
  @property({ type: shareVideoConfig, tooltip: "视频分享配置" })
  ShareVideoes: shareVideoConfig[] = [];

  public static ins: Main = null;

  onLoad() {
    this.loadData();
    Main.ins = this;
  }

  async start() {
    console.log(this.ShareVideoes);
    
    await this.loadRes();
  }

  async loadRes() {
    await ResMgr.ins.loadBundle(1, 0.15);
    await ResMgr.ins.loadRes(1, Assets.Sound, 0.2);
    await ResMgr.ins.loadRes(1, Assets.UiPrefab, 0.2);
    await ResMgr.ins.loadRes(1, Assets.NewYear, 0.2);
    await ResMgr.ins.loadRes(1, Assets.Frame, 0.2);

    await ResMgr.ins.loadRes(1, Assets.BrickPrefab, 0.3);
    await ResMgr.ins.loadRes(1, Assets.PropPrefab, 0.2);
    await ResMgr.ins.loadRes(1, Assets.Json, 0.2);
    await ResMgr.ins.loadRes(1, Assets.Spin, 0.2);//TODO:这里可能需要修改 0.5

    ResMgr.ins.getUI(ui.ToastView);

  }

  loadData() {
    Global.maxLv = this.maxLevel;
    let level = load(Key.Lv);
    if (!level) {
      level = this.currentLevel || 1;
      //   save(Key.Level, level);
    }
    Global.setLv(level);
    let propsSetting = load(Key.PropsSetting, 2);
    //  if(propsSetting) propsSetting = JSON.parse(propsSetting);
    //  debugger
    Global._propsSetting = propsSetting ? propsSetting : Global._propsSetting;

    const peopleSetting = load(Key.PeopleSetting, 2);
    Global.peopleSetting = peopleSetting ? peopleSetting : Global._peopleSetting;
    const cupSetting = load(Key.CupSetting, 2);
    Global.cupSetting = cupSetting ? cupSetting : Global._cupSetting;
    const receiveList = load(Key.ReceiveList, 2);
    Global.receiveList = receiveList ? receiveList : Global._receiveList;

    const codeList = load(Key.CodeList, 2);
    Global.codeList = codeList ? codeList : Global._codeList;
    // Global.setLv(this.currentLevel);
  }
  // update (dt) {}
}
