/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-09-09 22:16:27
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-09-09 22:53:30
 * @FilePath: \倒水游戏重构\assets\scripts\view\PeopleModalView.ts
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

const { ccclass, property } = cc._decorator;

@ccclass
export default class PeopleModalView extends BaseView {
  @property(cc.Label)
  peopleName: cc.Label = null;

  @property(cc.Label)
  peopleText: cc.Label = null;

  @property(cc.Sprite)
  peopleImg: cc.Sprite = null;

  private callback: Function;
  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  setInfo(name: string, detail: string, img: cc.SpriteFrame) {
    this.peopleName.string = name;
    this.peopleName.string = detail;
    this.peopleImg.spriteFrame = img;
  }

  setCallbackFn(cb) {
    this.callback = cb;
  }

  // 不要了
  close(): void {
    super.close();
    this.node.destroy();
  }

  getDebris() {
    this.callback && this.callback();
    this.close()
  }
  start() {}

  // update (dt) {}
}
