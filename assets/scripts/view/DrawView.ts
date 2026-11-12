/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-07-27 19:47:36
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-10-22 20:14:44
 * @FilePath: \倒水游戏重构\assets\scripts\view\DrawView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../Global";
import { getRandomIntInclusive } from "../com/index";
import { Clips, prop, ui } from "../enum/Enums";
import { _DrawOneInfo } from "../interfaces/BaseInter";
import { AudioMgr } from "../manager/AudioMgr";
import EnergyMgr from "../manager/EnergyMgr";
import PropBlockMgr from "../manager/PropBlockMgr";
import ResMgr from "../manager/ResMgr";
import BaseView from "./BaseView";
import PropModalView from "./PropModalView";

const { ccclass, property } = cc._decorator;
//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
enum GameState {
  Idle,
  Play,
}
@ccclass
export default class DrawView extends BaseView {
  @property(cc.Node)
  drawLayoutNode: cc.Node = null;

  @property(cc.Prefab)
  drawBox:cc.Prefab = null

  // LIFE-CYCLE CALLBACKS:
  //   般透明数值
  opcNum = 63;

  // onLoad () {}

  async start() {
    // setTimeout(async () => {
    let json = ResMgr.ins.getJson("draw");
    await this.init(json.json.data);
    // }, 5000);
    // let drawProps = ResMgr.ins.
  }

  // 源数组
  private _sourceArr: _DrawOneInfo[] = [];
  async init(arr: _DrawOneInfo[]) {
    this._sourceArr = arr;
    for (const oneInfo of arr) {
      let onePre = await ResMgr.ins.getUI(prop[oneInfo.key]);
      let onePreScript = onePre.getComponent(PropBlockMgr);
      onePreScript.setLabel(`${oneInfo.label}x${oneInfo.num}`);
     
      const drawBox = cc.instantiate(this.drawBox)
      onePre.parent = drawBox;
      drawBox.parent = this.drawLayoutNode
    }
  }

  private _index: number = 0;
  private _count: number = 0;
  private _targetIndex: number[] = [];
  private _state: GameState = GameState.Idle;
  startAni() {
    if (this._state == GameState.Play) {
      return;
    }
    let randomNum = getRandomIntInclusive(20, 50);
    this._targetIndex = [randomNum];
    this._count = 0;
    this._index = 0;
    this._state = GameState.Play;
    let node_list = this.drawLayoutNode.children;
    let moveOnce = () => {
      let seq = cc.sequence(
        cc.callFunc(() => {
          for (let item of node_list) {
            item.opacity = this.opcNum;
          }
          node_list[this._index].opacity = 255;
          this._count++;
          if (this._count > randomNum) {
            for (let item of node_list) {
              item.stopAllActions();
            }
            this._state = GameState.Idle;
            // UtilAudio.modalAudioClick();
            // this.resOpenModal();
            AudioMgr.ins.playSound(Clips.modal, 0.5);
            this.openModalView();
            //   弹弹窗 TODO:
            // console.log("open modal");
            // console.log("====================================");
            return;
          }
          if (this._index == this._targetIndex[this._count]) {
            node_list[this._index].stopAllActions();
            let blink = cc
              .sequence(cc.fadeOut(0.08), cc.fadeIn(0.08))
              .repeat(1);
            node_list[this._index].runAction(
              cc.sequence(
                blink,
                cc.callFunc(() => {
                  if (this._count < this._targetIndex.length) {
                    moveOnce();
                  } else {
                    this._state = GameState.Idle;
                  }
                })
              )
            );
          }
          AudioMgr.ins.playSound(Clips.draw, 0.1);

          this._index = (this._index + 1) % node_list.length;
        }),
        cc.delayTime(0.08)
      );
      node_list[this._index].runAction(seq.repeatForever());
    };
    super.showVideo(() => moveOnce());
  }
  close(): void {
    super.close();
    this.node.destroy();
  }

  async openModalView() {
    console.log("领奖励");
    // TODO:

    let info = this._sourceArr[this._index];//this._index
    // if(['reset','power'].includes(info.key)){
    //   debugger
    // }
    if (info.key === 'power') {
      EnergyMgr.ins.changeEnergy(true, +info.num)
    } else {
      Global.addPropsSetting(info.key, +info.num);
    }
    // Global.addPropsSetting(info.key, info.num);
    let propsView = await ResMgr.ins.getUI(ui.DrawPropsModalView);
    let propModalView = propsView.getComponent(PropModalView);
    propModalView.renderProps([info]);
    propModalView.watchVideoCallback = () => {
      if (info.key === 'power') {
        EnergyMgr.ins.changeEnergy(true, +info.num)
      } else {
        Global.addPropsSetting(info.key, +info.num);
      }
      console.log("领取奖励X2");
      // TODO:
    };
    propsView.parent = this.node;
  }
  // update (dt) {}
}
