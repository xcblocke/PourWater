/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-10-15 15:21:43
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-10-21 20:52:44
 * @FilePath: \倒水游戏重构\assets\scripts\view\VictoryModalView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../Global";
import { Title } from "../com/index";
import { events, titleArr } from "../enum/Enums";
import EnergyMgr from "../manager/EnergyMgr";
import BaseView from "./BaseView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VictoryModalView extends BaseView {
  @property(cc.RichText)
  nextLvDesc: cc.RichText = null;

  @property([cc.SpriteFrame])
  titleArr: cc.SpriteFrame[] = [];
  @property(cc.Sprite)
  titleSprite: cc.Sprite = null;
  @property(cc.Node)
  goFireBtn: cc.Node = null;

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    if (!window["tt"]) this.goFireBtn.active = false
    // this.titleArr
  }
  returnHome() {
    this.node.destroy();
    super.close();
    cc.director.emit(events.closeGame);
  }
  init() {

    Title.getNextLvDesc(Global.lv, titleArr);
    for (let i = 0; i < titleArr.length; i++) {
      const item = titleArr[i];
      if (Global.lv < item.lv) {
        this.titleSprite.spriteFrame = this.titleArr[i];
        break
      }
    }
    this.getLevelTitle();
  }
  getLevelTitle(lv?: number) {
    this.nextLvDesc.string = Title.getNextLvDesc(lv || Global.lv, titleArr);
  }
  loadLevel() {
    super.close();
    const energy = EnergyMgr.ins.changeEnergy(false);

    if (!energy) {
      cc.director.emit(events.Toast, `体力不足`)
      // cc.director.emit(events.OpenPowerModal)
      return
    }
    this.node.destroy();
    cc.director.emit(events.Next);
  }
  start() { }
  shareFn() {
    super.share(() => {
      // TODO:分享
      console.log("分享");
    });
  }
  videoPath!: string
  getVideoSharePath(videoPath) {
    this.videoPath = videoPath
  }
  onEnable() {
    cc.director.on(events.GoFire, this.getVideoSharePath, this);
  }
  onDisable() {
    cc.director.off(events.GoFire, this.getVideoSharePath, this);
  }
  goFire() {
    super.shareVideo(this.videoPath)
  }
  // update (dt) {}
}
