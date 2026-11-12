/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-09-05 22:05:27
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-10-21 22:35:48
 * @FilePath: \倒水游戏重构\assets\scripts\view\ShopView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../Global";
import { RoleStatus, ui } from "../enum/Enums";
import { AccessType, ShopOneInfo } from "../interfaces/BaseInter";
import ResMgr from "../manager/ResMgr";
import ShopCardItem, { LockState } from "../manager/ShopCardItem";
import { scrollFunc } from "../utils/Tools";
import BaseView from "./BaseView";
import PeopleModalView from "./PeopleModalView";

const peopleMap = {
  雷霆嘎巴帝王: { default: "thunderEmperor", lock: "lock-thunderEmperor" },
  火云邪神: { default: "fireGod", lock: "lock-fireGod" },
  红宝宝: { default: "redBaby", lock: "lock-redBaby" },
  霍格沃茨麻瓜: { default: "muggles", lock: "lock-muggles" },
  炼金术士: { default: "alchemist", lock: "lock-alchemist" },
  孟婆: { default: "goddessOld", lock: "lock-goddessOld" },
  太上老君: { default: "laotse", lock: "lock-laotse" },
};
const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopView extends BaseView {
  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;
  @property(cc.Node)
  content: cc.Node = null;

  // @property(cc.Integer)
  // nums: number = 0;

  @property(cc.Prefab)
  receiveItem: cc.Prefab = null;

  /** 间距 */
  @property(cc.Integer)
  spacing: number = 20;
  /** 每行几个 */
  @property(cc.Integer)
  rowNum: number = 2;

  @property(cc.Label)
  descLabel: cc.Label = null;
  /** 碎片数量 */
  @property(cc.Label)
  debrisNum: cc.Label = null;
  // LIFE-CYCLE CALLBACKS:

  /**
   * 设置碎片数量
   * @param num  数量
   */
  setDebrisNum(num: number) {
    this.debrisNum.string = num + "";
  }
  onLoad() {
    this.descLabel.string = "";
    this.setDebrisNum(Global.getPropsSetting("debris"));
  }

  async start() {
    // setTimeout(async () => {
      let json = ResMgr.ins.getJson("shop");
      await this.init(json.json.data);
    // }, 5000);
  }
  init(shopList: ShopOneInfo[]) {
    scrollFunc({
      list: shopList,
      spacing: this.spacing * 2,
      row: this.rowNum,
      scrollView: this.scrollView,
      content: this.content,
      receiveItemHeight: this.receiveItem.data.height,
      cb: this.setPreFab.bind(this),
    });
  }
  upInfo!: ShopOneInfo;
  /**
   *  点击卡片
   * @param info 点击卡片的信息
   * @returns
   */
  cardItemClick(info: ShopOneInfo) {
    if (this.upInfo === info) {
      this.descLabel.string = "";
      this.upInfo = undefined;
      return;
    }
    this.upInfo = info;
    // this.descLabel.string = info.ask || info.describe;
    const { isHave } = this.getItemStatus(info);
    if (isHave) {
      this.descLabel.string = info.describe;
    } else {
      this.descLabel.string = info.lockText;
    }
    console.log(info);
  }
  /** 点击卡片内的按钮 */
  cardItemBtnClick(info: ShopOneInfo, shopCardItem: ShopCardItem) {
    let { current } = Global.peopleSetting;
    for (const item of this.cards) {
      let { isHave } = this.getItemStatus(item.info);
      if (isHave) item.script.setState(RoleStatus.unlocked);
    }
    Global.setPeopleCurrent(info.id);
    return !(+current == info.id);
  }

  cards: { info: ShopOneInfo; script: ShopCardItem }[] = [];
  /**
   * 根据商品信息设置预制体
   * @param item 商品信息
   * @param i 预制体的下标
   */
  setPreFab(item: ShopOneInfo, i: number) {
    const { lvSatisfy, isHave, isDress } = this.getItemStatus(item);
    const itemPre = cc.instantiate(this.receiveItem);
    const shopCardItem = itemPre.getComponent(ShopCardItem);
    this.cards.push({ info: item, script: shopCardItem });
    shopCardItem.setItemFn(
      () => this.cardItemClick(item),
      (shopCardItem: ShopCardItem) => this.cardItemBtnClick(item, shopCardItem),
      (state: "debris" | "video") => this.unLockClick(state, item, shopCardItem)
    );
    let state = RoleStatus.locked;
    if (isHave) {
      if (isDress) {
        state = RoleStatus.selected;
      } else {
        state = RoleStatus.unlocked;
      }
    } else {
      state = RoleStatus.locked;
    }

    shopCardItem.setTagStatus(item.tag);
    if (lvSatisfy) {
      let showState =
        item.access === AccessType.Video ? LockState.video : LockState.debris;
      shopCardItem.showStateToLock(showState, item.price);
    }
    shopCardItem.setState(state);
    this.setImg(item, state, shopCardItem);
    itemPre.parent = this.content;
  }
  /**
   * 设置人物图片
   * @param item
   */
  async setImg(
    item: ShopOneInfo,
    state: RoleStatus,
    shopCardItem: ShopCardItem
  ) {
    let propleObj = peopleMap[item.name];
    const img = await ResMgr.ins.getFrameMap(
      state === RoleStatus.locked ? propleObj.lock : propleObj.default
    );
    shopCardItem.setNameAndPeopleBg(item.name, img);
  }
  /**
   * 判断是否满足解锁条件
   */
  getItemStatus(item: ShopOneInfo) {
    let { haveList, current } = Global.peopleSetting;
    /** 关卡是否已满足 */
    const lvSatisfy = +item.ask <= Global.lv;
    /**是否已拥有 */
    const isHave = haveList.includes(item.id+'');
    /** 是否已穿戴 */
    const isDress = +current == item.id;
    /** 碎片数量是否满足 */
    const isdebrisNumSatisfy = item.price <= Global.getPropsSetting("debris");
    return {
      /** 关卡是否已满足 */
      lvSatisfy,
      /**是否已拥有 */
      isHave,
      /** 碎片数量是否满足 */
      isdebrisNumSatisfy,
      /** 是否已穿戴 */
      isDress,
    };
  }
  getDebris() {
    console.log("获取碎片");
    // 看视频或者分享TODO:
    
    Global.addPropsSetting("debris", Global.addDebris);
          this.setDebrisNum(Global.getPropsSetting("debris"));
  }
  unLockClick(
    state: "debris" | "video",
    item: ShopOneInfo,
    shopCardItem: ShopCardItem
  ) {
    console.log(state);
    const saveRole = async () => {
      let PeopleModal = await ResMgr.ins.getUI(ui.PeopleModalView);
      PeopleModal.parent = this.node.parent;
      let peopleModalView = PeopleModal.getComponent(PeopleModalView);
      let propleObj = peopleMap[item.name];
      // TODO:加个loading
      const img = await ResMgr.ins.getFrameMap(propleObj.default);
      peopleModalView.setCallbackFn(this.getDebris.bind(this));
      peopleModalView.setInfo(item.name, item.describe,img);
      Global.setPeopleHaveList(item.id);
      shopCardItem.setState(RoleStatus.unlocked);
      this.setImg(item, RoleStatus.unlocked, shopCardItem);
    };
    switch (state) {
      case "video":
        super.showVideo(() => {
          saveRole();
        });

        break;
      case "debris":
        let { isdebrisNumSatisfy } = this.getItemStatus(item);
        if (isdebrisNumSatisfy) {
          Global.addPropsSetting("debris", -item.price);
          this.setDebrisNum(Global.getPropsSetting("debris"));
          
          saveRole();
        } else {
          console.log("碎片不足");
        }

        break;
      default:
        break;
    }
  }

  close(): void {
    super.close();
    this.node.destroy();
  }
  // update (dt) {}
}
