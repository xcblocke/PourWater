/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-07-23 12:31:11
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-10-22 21:32:02
 * @FilePath: \倒水游戏重构\assets\scripts\view\HomeView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global, defaultChallengeLv } from "../Global";
import { Clips, events, ui } from "../enum/Enums";
import EnergyMgr from "../manager/EnergyMgr";
import { AudioMgr } from "../manager/AudioMgr";
import ResMgr from "../manager/ResMgr";
import KeelReplaceSkin from "../manager/keelReplaceSkinMgr";
import BaseView from "./BaseView";
import GameView from "./GameView";
import RandomColorGameView from "./RandomColorGameView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HomeView extends BaseView {
  @property(KeelReplaceSkin)
  private replaceSkin: KeelReplaceSkin = null;
  @property(cc.Node)
  skinNode: cc.Node = null;
  @property(cc.Node)
  tipNode: cc.Node = null
  @property([cc.Node])
  skinList: cc.Node[] = [];
  // LIFE-CYCLE CALLBACKS:
  protected start(): void {

  }
  changeSpin(tag:string){
    if (tag==='C10') {//新年的
      this.skinList[0].active = true;
      this.skinList[1].active = false;
    }else{
      this.skinList[0].active = false;
      this.skinList[1].active = true;
    }
  }
  onLoad() {
    this.replaceSpin()
  }

  onEnable() {
    super.onEnable()
    AudioMgr.ins.playLoopSound(Clips.music);
    cc.director.on(events.closeGame, this.replaceSpin, this);
  }
  onDisable() {
    super.onDisable()
    cc.director.off(events.closeGame, this.replaceSpin, this);
  }
  replaceSpin() {

    const { current } = Global.peopleSetting;
    this.changeSpin(current)
    this.replaceSkin.replaceSkin(current.replace("C", "") as any);
  }
  async goGame() {
    const energy = EnergyMgr.ins.changeEnergy(false);

    if (!energy) {
      cc.director.emit(events.Toast, `体力不足`)
      // cc.director.emit(events.OpenPowerModal)
      return
    }

    const view = await ResMgr.ins.getUI(ui.GameView);
    let gameView = view.getComponent(GameView);
    gameView.init();
    view.parent = this.node.parent;
    // super.close();
  }
  async goChallengeGame() {
    if (Global.lv < Global.openChallenge_lv) {
      cc.director.emit(events.Toast, `关卡不足${Global.openChallenge_lv}不能进入`)
      return
    }

    Global.challenge_lv = defaultChallengeLv//TODO:

    const energy = EnergyMgr.ins.changeEnergy(false);

    if (!energy) {
      cc.director.emit(events.Toast, `体力不足`)
      // cc.director.emit(events.OpenPowerModal)
      return
    }

    const view = await ResMgr.ins.getUI(ui.RandomColorGameView);
    let randomColorGameView = view.getComponent(RandomColorGameView);
    randomColorGameView.init();
    view.parent = this.node.parent;
  }
  async muyuClick() {
    this.tipNode.active = false
    const gongdeView = await ResMgr.ins.getUI(ui.GongdeView);
    gongdeView.parent = this.skinNode;

  }
  // update (dt) {}
}
