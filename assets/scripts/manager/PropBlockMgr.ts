/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-07-27 20:18:37
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-09-29 12:51:28
 * @FilePath: \倒水游戏重构\assets\scripts\manager\PropBlockMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class PropBlockMgr extends cc.Component {
  @property(cc.Label)
  label: cc.Label = null;

  @property(cc.Boolean)
  labelShow: boolean = true;

  start() {
    if (!this.labelShow) {
      this.label.node.active = false;
    }
    this.setLabelColor(new cc.Color(255, 255, 255));
    this.setLabelFontSize(25)
  }

  setLabel(str: string) {
    this.label.string = str;
  }
  setLabelColor(color: cc.Color) {
    this.label.node.color = color;
  }
  setLabelFontSize(num: number) {
    this.label.fontSize = num;
  }
  // update (dt) {}
}
