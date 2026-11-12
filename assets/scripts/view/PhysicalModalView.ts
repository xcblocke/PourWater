/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-07-26 22:53:21
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-10-21 22:25:55
 * @FilePath: \倒水游戏重构\assets\scripts\view\PropsModalView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../Global";
import { Clips } from "../enum/Enums";
import { AudioMgr } from "../manager/AudioMgr";
import EnergyMgr from "../manager/EnergyMgr";
import BaseView from "./BaseView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PhysicalModalView extends BaseView {
  @property(cc.Label)
  powerLabel: cc.Label = null;

  start() {
    this.node.zIndex = 999
    this.powerLabel.string = "+" + Global.addEnergy;
  }
  // 获取奖励
  public getReward(): void {
    super.showVideo(() => {
      // 加体力
      EnergyMgr.ins.changeEnergy(true);
      AudioMgr.ins.playSound(Clips.reward);

      this.close();
      //TODO: 其他
    });
  }

  close(): void {
    super.close();
    this.node.destroy();
  }
  // update (dt) {}
}
