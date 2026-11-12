/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-09-04 21:56:17
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-09-09 17:22:02
 * @FilePath: \倒水游戏重构\assets\scripts\manager\ShopCardItem.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { RoleStatus, TagStatus } from "../enum/Enums";
import ResMgr from "./ResMgr";

const { ccclass, property } = cc._decorator;

type TItemClickFn = Function;
type TItemHireClickFn<T> = (shopCardItem: T) => boolean;
type TItemBuyClickFn = (state: "debris" | "video") => void;
export enum LockState {
  lock,
  debris,
  video,
}
@ccclass("TagGroup")
class TagGroup {
  @property({ type: cc.SpriteFrame, tooltip: "法" })
  [TagStatus.law]: cc.SpriteFrame = null;
  @property({ type: cc.SpriteFrame, tooltip: "神" })
  [TagStatus.god]: cc.SpriteFrame = null;
}
@ccclass("BuyGroup")
class BuyGroup {
  @property({ type: cc.Node, tooltip: "未解锁" })
  [LockState.lock]: cc.Node = null;
  @property({ type: cc.Node, tooltip: "碎片解锁" })
  [LockState.debris]: cc.Node = null;
  @property({ type: cc.Node, tooltip: "视频解锁" })
  [LockState.video]: cc.Node = null;
}
@ccclass
export default class ShopCardItem extends cc.Component {
  private _state = RoleStatus.unlocked;
  public get state() {
    return this._state;
  }
  public set state(value) {
    this._state = value;
  }

  @property(cc.Node)
  lockedGroup: cc.Node = null;

  @property(cc.Node)
  unlockedGroup: cc.Node = null;

  @property(cc.Node)
  selectedGroup: cc.Node = null;

  @property(TagGroup)
  tagGroup: TagGroup = new TagGroup();

  @property(BuyGroup)
  buyGroup: BuyGroup = new BuyGroup();

  @property(cc.Node)
  tagNode: cc.Node = null;

  /** 雇佣按钮 */
  @property(cc.Node)
  hireBtn: cc.Node = null;

  @property(cc.Label)
  nameLabel: cc.Label = null;

  @property(cc.Sprite)
  peopleBg: cc.Sprite = null;
  @property(cc.Sprite)
  peopleLockBg: cc.Sprite = null;

  // 设置名称和人物背景
  setNameAndPeopleBg(name: string, bg: cc.SpriteFrame) {
    this.nameLabel.string = name;
    this.peopleBg.spriteFrame = bg;
    this.peopleLockBg.spriteFrame = bg;
  }

  /**
   *  设置状态方法
   * @param state 设置角色状态
   */
  public setState(state: RoleStatus) {
   
    this.state = state;
    switch (state) {
      case RoleStatus.locked:
        this.lockedGroup.active = true;
        this.unlockedGroup.active = false;
        this.selectedGroup.active = false;
        this.hireBtn.active = false;
        break;
      case RoleStatus.unlocked:
        this.lockedGroup.active = false;
        this.unlockedGroup.active = true;
        this.selectedGroup.active = false;
        this.hireBtn.active = true;
        break;
      case RoleStatus.selected:
        this.lockedGroup.active = false;
        this.unlockedGroup.active = true;
        this.selectedGroup.active = true;
        this.hireBtn.active = false;
        break;
      default:
        break;
    }
  }

  /**
   * 改变标签状态
   * @param status 设置标签状态
   */
  public setTagStatus(status: TagStatus) {
    switch (status) {
      case TagStatus.god:
        this.tagNode.getComponent(cc.Sprite).spriteFrame =
          this.tagGroup[TagStatus.god];
        break;
      case TagStatus.law:
        this.tagNode.getComponent(cc.Sprite).spriteFrame =
          this.tagGroup[TagStatus.law];
        break;
      default:
        break;
    }
  }

  itemClickFn: TItemClickFn = null;
  itemHireClickFn: TItemHireClickFn<this> = null;
  itemBuyClickFn: TItemBuyClickFn = null;
  /**
   * 点击雇佣按钮
   */
  public hireClick() {
   
    if(!this.itemHireClickFn)return
    const bool =  this.itemHireClickFn(this);
    if (bool) {
      this.setState(RoleStatus.selected);
    } else {
      this.setState(RoleStatus.unlocked);
    }
  }
  /** 设置点击方法 */
  setItemFn(
    itemClickfn: TItemClickFn,
    itemHireClickFn: TItemHireClickFn<this>,
    itemBuyClickFn: TItemBuyClickFn
  ) {
    this.itemClickFn = itemClickfn;
    this.itemHireClickFn = itemHireClickFn;
    this.itemBuyClickFn = itemBuyClickFn;
  }
  /**
   * 整个元素点击
   */
  public onClick() {
    this.itemClickFn && this.itemClickFn(this);
  }
  // LIFE-CYCLE CALLBACKS:

  async onLoad() {
    
  }
  /**
   * 根据状态展示示范符合解锁条件
   * @param state
   */
  showStateToLock(state: LockState, num?: number) {
    switch (state) {
      case LockState.lock:
        this.buyGroup[LockState.lock].active = true;

        this.buyGroup[LockState.debris].active = false;
        this.buyGroup[LockState.video].active = false;
        break;
      case LockState.debris:
        this.buyGroup[LockState.debris].active = true;
        this.buyGroup[LockState.debris]
          .getChildByName("Label")
          .getComponent(cc.Label).string = num + "";

        this.buyGroup[LockState.lock].active = false;
        this.buyGroup[LockState.video].active = false;
        break;
      case LockState.video:
        this.buyGroup[LockState.video].active = true;

        this.buyGroup[LockState.lock].active = false;
        this.buyGroup[LockState.debris].active = false;
        break;

      default:
        break;
    }
  
  }
  buyBtnClick(e, state: "debris" | "video") {
    if (!["debris", "video"].includes(state)) return;
    this.itemBuyClickFn(state);
  }
  start() {}

  // update (dt) {}
}
