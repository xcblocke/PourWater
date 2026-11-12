/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-07-27 08:44:06
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-07-27 13:16:01
 * @FilePath: \倒水游戏重构\assets\scripts\manager\handleBtnMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../Global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BadgeBtnMgr extends cc.Component {
  @property(cc.Label)
  badgeLabel: cc.Label = null;

  @property(cc.Node)
  badgeNode: cc.Node = null;

  @property(cc.Boolean)
  haveBadge: boolean = false;

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {
    if (this.haveBadge) {
      this.badgeLabel.node.active = true;
    }
  }

  setNumToLabel(num: number) {
    if (num <= 0) {
      this.badgeNode.active = false;
    } else {
      this.badgeNode.active = true;
      this.badgeLabel.string = num + "";
    }
  }
  update(dt) {}
}
