/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-07-25 22:26:36
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-07-25 22:36:48
 * @FilePath: \倒水游戏重构\assets\scripts\manager\SettingMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../Global";
import { Clips, events, ui } from "../enum/Enums";
import { AudioMgr } from "../manager/AudioMgr";
import ResMgr from "../manager/ResMgr";
import BaseView from "./BaseView";

const { ccclass, property } = cc._decorator;

@ccclass("SpriteFrameState")
export class SpriteFrameState {
  @property(cc.SpriteFrame)
  on: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  off: cc.SpriteFrame = null;
}

@ccclass
export default class SettingView extends BaseView {
  @property(SpriteFrameState)
  bgm: SpriteFrameState = null;
  @property(SpriteFrameState)
  sound: SpriteFrameState = null;
  @property(cc.Sprite)
  bgmSprite: cc.Sprite = null;
  @property(cc.Sprite)
  soundSprite: cc.Sprite = null;
  start() {
    this.checkSpriteFrame("bgm");
    this.checkSpriteFrame("sound");
  }
  changeBgm() {
    Global.bgm *= -1;
    this.checkSpriteFrame("bgm");
    cc.director.emit(events.changeSound, "bgm");
  }
  checkSpriteFrame(name: "bgm" | "sound") {
    switch (name) {
      case "bgm":
        if (Global.bgm == 1) {
          this.bgmSprite.spriteFrame = this.bgm.on;
          AudioMgr.ins.playLoopSound(Clips.music);
        } else {
          this.bgmSprite.spriteFrame = this.bgm.off;
          AudioMgr.ins.stopLoopSound();

        }
        break;
      case "sound":
        if (Global.sound == 1) {
          this.soundSprite.spriteFrame = this.sound.on;
        } else {
          this.soundSprite.spriteFrame = this.sound.off;
        }
        break;
    }
  }
  changeSound() {
    Global.sound *= -1;
    this.checkSpriteFrame("sound");
    cc.director.emit(events.changeSound, "sound");
  }
  async openCodeModal() {
    let propsView = await ResMgr.ins.getUI(ui.RedemptionCodeInputView);
    propsView.parent = this.node
  }
  close() {
    super.close()
    this.node.destroy();
  }
  // update (dt) {}
}
