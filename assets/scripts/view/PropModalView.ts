/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-08-12 15:47:33
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-10-23 22:46:06
 * @FilePath: \倒水游戏重构\assets\scripts\view\PropModalView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Clips, prop } from "../enum/Enums";
import { _DrawOneInfo } from "../interfaces/BaseInter";
import { AudioMgr } from "../manager/AudioMgr";
import PropBlockMgr from "../manager/PropBlockMgr";
import ResMgr from "../manager/ResMgr";
import BaseView from "./BaseView";

const { ccclass, property } = cc._decorator;
//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
@ccclass
export default class PropModalView extends BaseView {
  @property(cc.Node)
  btnGroup: cc.Node = null;

  @property(cc.Node)
  propLayout: cc.Node = null;

  @property(cc.Node)
  labelLayout: cc.Node = null;
  // LIFE-CYCLE CALLBACKS:

  //   领奖励回调
  private _watchVideoCallback: Function = null;
  // onLoad () {}

  set watchVideoCallback(callback: Function) {
    this._watchVideoCallback = callback;
  }
  get watchVideoCallback() {
    return this._watchVideoCallback;
  }
  start() { }
  private oldPropList = [];
  /**
   *  渲染道具
   * @param propList  道具列表
   */
  renderProps(propList: _DrawOneInfo[]) {
    this.oldPropList = propList;
    for (const oneInfo of propList) {
      this.renderPropBlock(oneInfo);
      this.renderLabel(oneInfo);
    }
  }
  private async renderPropBlock(propOne: _DrawOneInfo) {
    let onePre = await ResMgr.ins.getUI(prop[propOne.key]);
    onePre.getComponent(PropBlockMgr).labelShow = false;
    onePre.parent = this.propLayout;
  }
  private renderLabel(propOne: _DrawOneInfo, isDouble = false) {
    let node = new cc.Node();
    // 创建一个Label
    node.name = "LabelNode";
    const labelOutline = node.addComponent(cc.LabelOutline)
    labelOutline.color = cc.Color.BLACK
    labelOutline.width = 4
    // 创建一个Label组件
    const label = node.addComponent(cc.Label);
    label.fontSize = 44;
    label.fontFamily = "Arial";
    label.enableBold = true
    // ${propOne.label}
    label.string = `x${isDouble ? propOne.num * 2 : propOne.num
      }`;
    node.parent = this.labelLayout;
  }
  //   清除Label
  private clearnLabel() {
    this.labelLayout.removeAllChildren();
  }
  //   看视频领奖励
  onWatchVideo() {
    if (this.watchVideoCallback) {
      super.showVideo(() => {
        console.log('看视频领取奖励');

        AudioMgr.ins.playSound(Clips.modal, 0.5);
        this.btnGroup.active = false;
        this.clearnLabel();
        for (const item of this.oldPropList) {
          this.renderLabel(item, true);
        }
        this.watchVideoCallback();
      });
    }
  }
  close(): void {
    super.close();
    this.node.destroy();
  }
  // update (dt) {}
}
