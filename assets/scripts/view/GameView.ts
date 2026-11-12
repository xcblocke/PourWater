/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-07-20 22:42:00
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-10-24 22:37:01
 * @FilePath: \倒水游戏重构\assets\scripts\view\GameView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../Global";
import { DyRecorderManager } from "../ad/DyRecorderManager";
import { Clips, Key, events, ui } from "../enum/Enums";
import PropMgr from "../game/PropMgr";
import { AudioMgr } from "../manager/AudioMgr";
import CupMgr from "../manager/CupMgr";
import { PoolMgr } from "../manager/PoolMgr";
import ResMgr from "../manager/ResMgr";
import KeelReplaceSkin from "../manager/keelReplaceSkinMgr";
import { load } from "../utils/Tools";
import BaseView from "./BaseView";
import VictoryModalView from "./VictoryModalView";

interface Props {
  reset: number;
  back: number;
  tube: number;
  next: number;
}
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameView extends BaseView {
  @property(KeelReplaceSkin)
  private replaceSkin: KeelReplaceSkin = null;
  @property(cc.Node)
  skinNode: cc.Node = null;
  @property([cc.Node])
  skinList: cc.Node[] = [];
  @property(cc.RichText)
  lvLabel: cc.RichText = null;

  @property(PropMgr)
  resetMgr: PropMgr = null;

  @property(PropMgr)
  backMgr: PropMgr = null;

  @property(PropMgr)
  tubeMgr: PropMgr = null;



  public static ins: GameView = null;

  replaceSpin() {
    const { current } = Global.peopleSetting;
    this.changeSpin(current)
    this.replaceSkin.replaceSkin(current.replace("C", "") as any);
  }
  onEnable() {
    cc.director.on(events.closeGame, this.goBack, this);
    cc.director.on(events.LevelFinish, this.GameResult, this);
  }
  onDisable() {
    cc.director.off(events.closeGame, this.goBack, this);
    cc.director.off(events.LevelFinish, this.GameResult, this);
  }

  start() {
    GameView.ins = this;
  }

  setLvLabel(_lv?: number) {
    // level为白色加粗 Global.lv为黄色
    this.lvLabel.string = `<b><color=#000000>level  </c><color=#FA5A00>${Global.lv}</c></b>`;
  }
  //#region  按钮操作区域
  /** 点击重置按钮 */
  public onResetClick(e) {
    console.log(Global.getPropsSetting("reset"));

    if (Global.getPropsSetting("reset") > 0) {
      Global.addPropsSetting("reset", -1);
      cc.director.emit(events.Reset);
    } else {
      console.log(e.target);
      // 当有数量时候先用对应数量，否则看广告TODO:
      super.showVideo(() => {
        cc.director.emit(events.Reset);
      });
    }
    this.setProps(Global._propsSetting);
  }

  /** 点击回到上一步 */
  public onBackClick(e) {
    if (!CupMgr.ins.checkCanUndo()) return;
    if (Global.getPropsSetting("back") > 0) {
      Global.addPropsSetting("back", -1);
      cc.director.emit(events.Back);
    } else {
      console.log(e.target);
      // 当有数量时候先用对应数量，否则看广告TODO:
      super.showVideo(() => {
        cc.director.emit(events.Back);
      });
    }
    this.setProps(Global._propsSetting);
  }

  /** 点击下一关按钮 */
  public onNextClick(e: cc.Event.EventTouch) {
    // if (Global.getPropsSetting("next") >= 0) {
    //   Global.addPropsSetting("next", -1);
    //   this.GameResult();
    // }
    // console.log(e.target);
    // 当有数量时候先用对应数量，否则看广告TODO:
    super.showVideo(() => {
      // console.log('是不是进来好几次');

      // Global.addLv();
      // cc.director.emit(events.Next);
      // this.init();
      this.GameResult();
    });
  }
  onceAdd = false
  /** 点击加管按钮 */
  public onAddTubeClick(e: cc.Event.EventTouch) {
    if (this.onceAdd) {
      console.log('只能添加一个试管');
      cc.director.emit(events.Toast, `每关只能添加一个试管`)
      return
    }
    if (!CupMgr.ins.checkCanAddTube()) return;
    if (Global.getPropsSetting("tube") > 0) {
      Global.addPropsSetting("tube", -1);
      this.onceAdd = true
      cc.director.emit(events.AddTube);
    } else {
      console.log(e.target);
      // 当有数量时候先用对应数量，否则看广告TODO:
      super.showVideo(() => {
        this.onceAdd = true
        cc.director.emit(events.AddTube);
      });
    }
    this.setProps(Global._propsSetting);
  }

  /** 点击时间停止按钮 */
  public onTimeStopClick(e: cc.Event.EventTouch) {
    console.log(e.target);
    // 当有数量时候先用对应数量，否则看广告TODO:
    super.showVideo(() => {
      cc.director.emit(events.TimeStop);
    });
  }

  /** 点击随机按钮 */
  public onRandomClick(e: cc.Event.EventTouch) {
    console.log(e.target);
    // 当有数量时候先用对应数量，否则看广告TODO:
    super.showVideo(() => {
      cc.director.emit(events.Random);
    });
  }
  //#endregion

  async GameResult() {

    this.onceAdd = false
    Global.addLv();
    AudioMgr.ins.playSound(Clips.Show_Victory);
    this.init();
    const view = await ResMgr.ins.getUI(ui.ResultView);
    // cc.instantiate(view)
    cc.find("Canvas").addChild(view);
    view.getComponent(VictoryModalView).init();
    const videoPath = await DyRecorderManager.ins.stop()
    console.log(videoPath, 'videoPath');

    cc.director.emit(events.GoFire, videoPath);

  }
  init() {
    this.setLvLabel();
    let propsSetting = load(Key.PropsSetting, 2);
    Global._propsSetting = propsSetting ? propsSetting : Global._propsSetting;
    // TODO:
    this.setProps(Global._propsSetting);
    this.replaceSpin();
  }


  goBack() {
    console.log('游戏返回');
    DyRecorderManager.ins.stop()
    super.close();
    //  PoolMgr.ins.getNode("HomeView", this.node.parent);
    this.node.destroy();
  }

  setProps(props: Props) {
    this.resetMgr.setNum(props.reset);
    this.backMgr.setNum(props.back);
    this.tubeMgr.setNum(props.tube);
  }
  changeSpin(tag: string) {
    if (tag === 'C10') {//新年的
      this.skinList[0].active = true;
      this.skinList[1].active = false;
    } else {
      this.skinList[0].active = false;
      this.skinList[1].active = true;
    }
  }
  async muyuClick() {
    const gongdeView = await ResMgr.ins.getUI(ui.GongdeView);
    gongdeView.parent = this.skinNode;
  }
}
