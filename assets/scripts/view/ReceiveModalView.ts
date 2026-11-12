/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-07-28 23:02:24
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-10-23 23:03:52
 * @FilePath: \倒水游戏重构\assets\scripts\view\ReceiveModalView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../Global";
import { getPropNameByType } from "../com/index";
import { Clips, PropType, events, ui } from "../enum/Enums";
import { AccessType, TaskOneInfo, _DrawOneInfo } from "../interfaces/BaseInter";
import { AudioMgr } from "../manager/AudioMgr";
import EnergyMgr from "../manager/EnergyMgr";
import ReceiveItem from "../manager/ReceiveItem";
import ResMgr from "../manager/ResMgr";
import BaseView from "./BaseView";
import PropModalView from "./PropModalView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ReceiveModalView extends BaseView {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;
  @property(cc.Node)
  content: cc.Node = null;

  // @property(cc.Integer)
  // nums: number = 0;

  @property(cc.Prefab)
  receiveItem: cc.Prefab = null;

  @property(cc.Integer)
  receiveItemHeight: number = 0;

  /** 间距 */
  @property(cc.Integer)
  spacing: number = 20;

  // LIFE-CYCLE CALLBACKS:
  ins: ReceiveModalView;
  async onLoad() {
    this.ins = this;
    // setTimeout(async () => {
    let json = ResMgr.ins.getJson("task");
    await this.init(json.json.data);
    // }, 3000);
  }
  tasks: TaskOneInfo[];
  init(tasks: TaskOneInfo[]) {
    this.tasks = tasks.map((item) => ({ ...item, status: Global.receiveList.includes(item.id + '') }));
    this.content.removeAllChildren();
    let nums = tasks.length;
    this.content.height = nums * (this.receiveItemHeight + this.spacing);
    for (let i = 0; i < nums; i++) {
      let item = tasks[i];
      let itemPre = cc.instantiate(this.receiveItem);
      let receiveItemScript = itemPre.getComponent(ReceiveItem)
      receiveItemScript.setTaskInfo(item, Global.receiveList.includes(item.id + '') ? 'select' : 'unselect');
      // receiveItemScript.setClickFn(this.openModalView.bind(this, item))
      receiveItemScript.setClickFn((cb) => {
        if (item.access === AccessType.Video) {
          // super.showVideo(this.openModalView.bind(this, item))
          super.showVideo(() => {
            console.log('看视频领取奖励');
            this.openModalView(item)
            cb()
          })
        } else {
          super.share(() => {
            this.openModalView(item)
            cb()
          })
        }
      })
      itemPre.parent = this.content;
    }
    //滚动到0位置
    this.scrollView.scrollToTop(0);
  }
  // 获取未完成的数量
  getUnfinishedNum() {
    let num = 0;
    this.tasks.forEach((item) => {
      if (item.status) {
        num++;
      }
    });
    return num;
  }
  start() { }

  close(): void {
    super.close();
    this.node.destroy();
    cc.director.emit(events.ReceiveClose);

  }

  async openModalView(info: TaskOneInfo) {
    console.log("领奖励", info);
    // TODO:
    const key = getPropNameByType(info.type) as _DrawOneInfo["key"]
    const label = getPropNameByType(info.type, true)
    Global.setReceiveList(info.id + '')
    if (info.type === PropType.power) {
      EnergyMgr.ins.changeEnergy(true, +info.num)
    } else {
      Global.addPropsSetting(key, info.num);

    }
    AudioMgr.ins.playSound(Clips.modal, 0.5);
    let propsView = await ResMgr.ins.getUI(ui.PropsModalView);
    let propModalView = propsView.getComponent(PropModalView);
    propModalView.renderProps([{ ...info, key, label: label as any }]);
    propModalView.watchVideoCallback = () => {
      if (info.type === PropType.power) {
        EnergyMgr.ins.changeEnergy(true, +info.num)
      } else {
        Global.addPropsSetting(key, info.num);

      }
      console.log("领取奖励X2");
      // TODO:
    };
    propsView.parent = this.node;
  }
  // update (dt) {}
}
