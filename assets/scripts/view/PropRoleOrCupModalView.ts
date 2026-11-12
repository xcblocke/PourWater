/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-10-21 13:06:55
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-10-21 13:44:14
 * @FilePath: \倒水游戏重构\assets\scripts\view\PropRoleOrCupModal.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 *///电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 https://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 https://web3incubators.com/kefu.html
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseView from "./BaseView";
import { Tab_Tag } from "./ShopModalView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PropRoleOrCupModalView extends BaseView {
  @property([cc.SpriteFrame])
  titleArr: cc.SpriteFrame[] = [];

  @property(cc.Sprite)
  titleSprite: cc.Sprite = null;
  @property(cc.Sprite)
  propSprite: cc.Sprite = null;
  // LIFE-CYCLE CALLBACKS:
  @property(cc.Node)
  rootNode: cc.Node = null;
  // onLoad () {}

  start() { }
  setTitleImg(tag: Tab_Tag) {
    this.titleSprite.spriteFrame = this.titleArr[tag];
  }

  setPropImg(img: cc.SpriteFrame) {
    this.propSprite.spriteFrame = img;
  }
  setScale(scale: number) {
    this.rootNode.scale = scale;
  }
  cancelFn: Function;
  close(): void {
    this.node.destroy();
    if (this.cancelFn) this.cancelFn();
  }
  // update (dt) {}
}
