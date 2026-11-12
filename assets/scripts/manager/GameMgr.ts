/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-07-17 22:29:15
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-07-23 11:54:23
 * @FilePath: \倒水游戏重构\assets\scripts\manager\GameMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../Global";
import { Clips, events } from "../enum/Enums";
import { AudioMgr } from "./AudioMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMgr extends cc.Component {

  start() {
    cc.director.on(events.Do_pour, this.onDo_pour, this);
    cc.director.on(events.LevelFinish, this.onLevelFinish, this);
  }
  onDisable() {
    cc.director.off(events.Do_pour, this.onDo_pour, this);
    cc.director.off(events.LevelFinish, this.onLevelFinish, this);
  }
  /**
   *
   */
  private onDo_pour() {
    // this.node.active = false;
    console.log('====================================');
    console.log('onDo_pour');
    console.log('====================================');
  }
  /**
   * 关卡结束
   */
  private onLevelFinish() {
    console.log('====================================');
    console.log('onLevelFinish');
    console.log('====================================');
    AudioMgr.ins.playSound(Clips.Show_Victory);
    
    // this.node.active = false;
    // Global.lv++;
  }
}
