/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-09-12 23:25:34
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-10-21 18:28:12
 * @FilePath: \倒水游戏重构\assets\scripts\Test.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "./Global";
import { events, ui } from "./enum/Enums";
import { _DrawOneInfo } from "./interfaces/BaseInter";
import EnergyMgr from "./manager/EnergyMgr";
import ResMgr from "./manager/ResMgr";
import KeelReplaceSkin from "./manager/keelReplaceSkinMgr";
import RedemptionCodeModalView from "./view/RedemptionCodeModalView";

const { ccclass, property } = cc._decorator;
/* "code": "1bslbN5L",
    "list": [
      {
        "label": "重置",
        "key": "reset",
        "num": 1
      },
      {
        "label": "体力",
        "key": "power",
        "num": 3
      } */

// RedemptionCodeInputView
// 1-3随机数
function random(): number {
  return Math.floor(Math.random() * 3) + 1;
}
@ccclass
export default class NewClass extends cc.Component {
  @property(KeelReplaceSkin)
  private replaceSkin: KeelReplaceSkin = null;

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}
  changeSpin() {
    /* _ske
_tex */
    // dbAsset
    // dbAtlas
    let name = "NewProject";
    let dbAsset = ResMgr.ins.getSpin(name + "_ske");
    let dbAtlas = ResMgr.ins.getSpin(name + "_tex");
    debugger;
    // this.replaceSkin.replaceSkin(
    //   dbAsset as any,
    //   dbAtlas as any,
    //   "Armature",
    //   "动作" + random()
    // );
  }
  async testfn(e) {
    console.log(e.string);
   


  }
  start() { }

  // update (dt) {}
}
