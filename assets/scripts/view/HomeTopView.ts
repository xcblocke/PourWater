/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-07-25 07:29:54
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-09-09 23:17:41
 * @FilePath: \倒水游戏重构\assets\scripts\view\HomeTopView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../Global";
import { Title } from "../com/index";
import { Key, events, titleArr, ui } from "../enum/Enums";
import BadgeBtnMgr from "../manager/BadgeBtnMgr";
import ResMgr from "../manager/ResMgr";
import { getDate, load } from "../utils/Tools";
import BaseView from "./BaseView";

const { ccclass, property } = cc._decorator;
@ccclass("ModalGroup")
export class ModalGroup {
  @property(cc.Prefab)
  settingModal: cc.Prefab = null;
  //   @property(cc.Prefab)
  //   powerModal: cc.Prefab = null;
}
@ccclass
export default class HomeTopView extends BaseView {
  @property(ModalGroup)
  modalGroup: ModalGroup = null;

  @property(cc.RichText)
  nextLvDesc: cc.RichText = null;

  @property(BadgeBtnMgr)
  receiveBtnMgr: BadgeBtnMgr = null

  @property(cc.Node)
  leftAddBtn: cc.Node = null;


  // LIFE-CYCLE CALLBACKS:

  static ins: HomeTopView
  onLoad() {
    HomeTopView.ins = this
  }

  onEnable() {
    super.onEnable()
    cc.director.on(events.ReceiveClose, this.setReceiveListDate, this);
    cc.director.on(events.OpenPowerModal, this.showPowerModal, this);

  }
  onDisable() {
    super.onDisable()
    cc.director.off(events.ReceiveClose, this.setReceiveListDate, this);
    cc.director.off(events.OpenPowerModal, this.showPowerModal, this);

  }
  setReceiveListDate() {
    const receiveListTime = load(Key.ReceiveListTime, 0)
    if (getDate() !== receiveListTime) {
      Global.clearReceiveList()
    }
    this.receiveBtnMgr.setNumToLabel(Global.action_step - Global.receiveList.length)
  }

  start() {
    const { haveList } = Global.peopleSetting;
    this.nextLvDesc.string = Title.getNextLvDesc(Global.lv, titleArr);
    this.setReceiveListDate()
    if (!window["tt"]) this.leftAddBtn.active = false
    if (!haveList.includes('C10')) {
      this.showNewYearModal()
    }
  }
  /**
   * 打开设置弹窗
   */
  showSettings() {
    let settingModal = cc.instantiate(this.modalGroup.settingModal);
    settingModal.parent = this.node.parent;
  }

  /** 抽奖 */
  async showLotteryModal() {
    let drawView = await ResMgr.ins.getUI(ui.DrawView);
    drawView.parent = this.node.parent;

  }

  /** 签到 */
  async showSignModal() {
    let SignModalView = await ResMgr.ins.getUI(ui.SignModalView);
    SignModalView.parent = this.node.parent;
  }

  /** 任务 */
  async showTaskModal() {
    let taskView = await ResMgr.ins.getUI(ui.ReceiveModalView);
    taskView.parent = this.node.parent;
  }

  /** 商城 */
  async showShopModal() {
    let shopView = await ResMgr.ins.getUI(ui.ShopView);
    shopView.parent = this.node.parent;
  }
  // 弹体力
  async showPowerModal() {
    let physicalView = await ResMgr.ins.getUI(ui.PhysicalModalView);
    physicalView.parent = cc.find("Canvas");
    // TODO:
  }
  // 弹体力
  async showNewYearModal() {
    let dragonAVModal = await ResMgr.ins.getUI(ui.DragonAVModal);
    dragonAVModal.parent = this.node.parent;
    // TODO:
  }

  async openAddModal() {
    let addModal = await ResMgr.ins.getUI(ui.AddModalView);
    addModal.parent = this.node.parent;
  }
  // update (dt) {}
}
