/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-10-21 21:47:06
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-10-21 22:32:27
 * @FilePath: \倒水游戏重构\assets\scripts\ctrl\LoadCtrl.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../Global";
import { ui } from "../enum/Enums";
import ResMgr from "../manager/ResMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadCtrl extends cc.Component {
  @property(cc.ProgressBar)
  load: cc.ProgressBar = null;

  @property(cc.Node)
  loadingNode: cc.Node = null;

  private isload = true;

  async closeLoad() {
    const homeTopView = await ResMgr.ins.getUI(ui.HomeTopView);
    const homeView = await ResMgr.ins.getUI(ui.HomeView);
    
    homeView.parent = this.node.parent;
    homeTopView.parent = this.node.parent;
    
    this.isload = false;
    this.loadingNode.active = false;

    this.node.destroy();
  }
  once=false
  update(deltaTime: number) {
    if (!this.isload) return;
    this.load.progress = Global.LoadingRate;
    if (Global.LoadingRate >= 0.99 && !this.once) {
      this.once = true;
      this.closeLoad();
    }
  }
}
