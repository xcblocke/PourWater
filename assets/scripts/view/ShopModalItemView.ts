/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-10-15 13:02:49
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-10-15 13:39:59
 * @FilePath: \倒水游戏重构\assets\scripts\view\ShopModalItemView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseView from "./BaseView";

const { ccclass, property } = cc._decorator;

@ccclass("ShopModalItemSpriteFrames")
export class ShopModalItemSpriteFrames {
  @property(cc.SpriteFrame)
  default: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  have: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  check: cc.SpriteFrame = null;
}

@ccclass
export default class ShopModalItemView extends cc.Component {
  @property(ShopModalItemSpriteFrames)
  imgs: ShopModalItemSpriteFrames = null;

  checkState(state: "default" | "have" | "check") {
    switch (state) {
      case "have":
        this.node.getComponent(cc.Sprite).spriteFrame = this.imgs.have;
        break;
      case "check":
        this.node.getComponent(cc.Sprite).spriteFrame = this.imgs.check;

      default:
        break;
    }
  }
  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {}

  // update (dt) {}
}
