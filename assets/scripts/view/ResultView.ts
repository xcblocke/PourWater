/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-07-22 09:28:58
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-08-12 22:46:00
 * @FilePath: \倒水游戏重构\assets\scripts\view\ResultView.ts
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
export default class ResultView extends BaseView {
  @property(cc.Label)
  lvLabel: cc.Label = null;

  @property(cc.Label)
  lvTitle: cc.Label = null;

  @property(cc.Label)
  lvDesc: cc.Label = null;

  @property(cc.RichText)
  nextLvDesc: cc.RichText = null;

  returnHome() {
    cc.director.emit(events.closeGame);
   this.node.destroy();
   super.close();
  }
  init() {
    Global.addLv();
    this.getLevelTitle();
  }

  /* go next LEvel */
  async next() {
    // TODO:获取体力看能不能进入下一关
    const energy = EnergyMgr.ins.changeEnergy(false);

    if (!energy) {
      cc.director.emit(events.Toast, `体力不足`)
      console.log('====================================');
      console.log('体力不足，无法进入下一关');
      console.log('====================================');
        return
    };

    // this.isWatchAd = this.videoToggle.isChecked = this.videoNode.active = false
    this.loadLevel();
  }


  getLevelTitle(lv?: number) {
    this.lvTitle.string = Title.getTitle(lv||Global.lv, titleArr)
    this.lvDesc.string = Title.getDesc(lv||Global.lv, titleArr)
    this.nextLvDesc.string = Title.getNextLvDesc(lv||Global.lv, titleArr)
  }
  loadLevel() {
    super.close();
    this.node.destroy();
  }

  // onLoad () {}

  start() {
  }

  // update (dt) {}
}
