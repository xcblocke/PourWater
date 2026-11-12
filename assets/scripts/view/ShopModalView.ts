/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-10-15 13:35:17
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-10-23 23:05:32
 * @FilePath: \倒水游戏重构\assets\scripts\view\ShopModalView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-10-15 13:35:17
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-10-21 12:27:20
 * @FilePath: \倒水游戏重构\assets\scripts\view\ShopModalView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../Global";
import { Clips, events, ui } from "../enum/Enums";
import { AudioMgr } from "../manager/AudioMgr";
import ResMgr from "../manager/ResMgr";
import { randomNum, scrollFunc } from "../utils/Tools";
import BaseView from "./BaseView";
import PropRoleOrCupModalView from "./PropRoleOrCupModalView";
import ShopModalItemView from "./ShopModalItemView";
import TabView from "./TabView";

const { ccclass, property } = cc._decorator;

export enum Tab_Tag {
  CUP = "0",
  ROLE = "1",
}
@ccclass
export default class ShopModalView extends BaseView {
  @property([cc.SpriteFrame])
  cupsFrame: cc.SpriteFrame[] = [];
  @property([cc.SpriteFrame])
  rolesFrame: cc.SpriteFrame[] = [];

  @property(cc.Prefab)
  shopCardItem: cc.Prefab = null;

  @property(TabView)
  tabView: TabView = null;

  @property(cc.ScrollView)
  scrollView: cc.ScrollView = null;
  @property(cc.Node)
  content: cc.Node = null;

  /** 间距 */
  @property(cc.Integer)
  spacing: number = 20;
  /** 每行几个 */
  @property(cc.Integer)
  rowNum: number = 2;
  // LIFE-CYCLE CALLBACKS:
  init(shopList: string[], tag: Tab_Tag) {
    //TODO:
    scrollFunc({
      list: shopList,
      spacing: this.spacing * 2,
      row: this.rowNum,
      scrollView: this.scrollView,
      content: this.content,
      receiveItemHeight: this.shopCardItem.data.height,
      cb: this.setPreFab.bind(this, tag),
    });
  }
  shopItems: string[] = ["01", "02", "03", "04", "05", "06", "07", "08", "09"];
  /**
   * 根据商品信息设置预制体
   * @param item 商品信息
   * @param i 预制体的下标
   */
  setPreFab(tag: Tab_Tag, item: string, i: number, list: string[]) {
    // console.log(item,'setPreFab');
    // TODO: 这里可能不需要改，记得确认下
    let setting, setFn, sprites;
    if (tag === Tab_Tag.CUP) {
      setting = Global.cupSetting;
      setFn = Global.setCupCurrent;
      sprites = this.cupsFrame;
    } else {
      setting = Global.peopleSetting;
      setFn = Global.setPeopleCurrent;
      sprites = this.rolesFrame;
    }
    const cardItem = cc.instantiate(this.shopCardItem);
    const cardItemScript: ShopModalItemView =
      cardItem.getComponent(ShopModalItemView);
    const { current, haveList } = setting;
    cardItem.on("click", () => {
      const haveState = haveList.includes(item);
      if (!haveState || current === item) return;
      setFn(item);
      this.tabChange(tag);
    });
    if (current === item) {
      cardItemScript.checkState("check");
      cardItem.getChildByName("node").getComponent(cc.Sprite).spriteFrame =
        sprites[+item.replace('C', '') - 1];
      cardItem.getChildByName("node").active = true;
    } else if (haveList.includes(item)) {
      cardItemScript.checkState("have");
      cardItem.getChildByName("node").getComponent(cc.Sprite).spriteFrame =
        sprites[+item.replace('C', '') - 1];
      cardItem.getChildByName("node").active = true;
    }

    // cardItem.addChild
    cardItem.parent = this.content;
  }

  tabIndex: Tab_Tag;
  tabChange(tag: Tab_Tag) {
    this.tabIndex = tag;
    console.log(tag);
    switch (tag) {
      case Tab_Tag.CUP:
        this.init(this.shopItems, tag);
        break;
      case Tab_Tag.ROLE:
        const { haveList } = Global.peopleSetting;
        const shopItems = this.shopItems.map((item) => "C" + item)
        //TODO:  角色得特殊处理下 区分有没有吉祥物 吉祥物 C10
        if (haveList.includes('C10')) {
          shopItems.unshift('C10')
          this.init(
            shopItems,
            tag
          );
        } else {
          this.init(
            shopItems,
            tag
          );
        }

        break;
      default:
        break;
    }
  }
  /* 
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
  */
  onLoad() {
    // setTimeout(() => {
    this.tabChange(Tab_Tag.CUP);
    // }, 2000);
  }
  goBack(): void {
    super.close();
    //  PoolMgr.ins.getNode("HomeView", this.node.parent);
    this.node.destroy();
    cc.director.emit(events.closeGame);
  }
  start() {
    this.tabView.tabCb = this.tabChange.bind(this);
  }
  async gainRewards() {
    let setting, setFn, sprites;
    if (this.tabIndex === Tab_Tag.CUP) {
      setting = Global.cupSetting;
      setFn = Global.setCupHavaList;
      sprites = this.cupsFrame;
    } else {
      setting = Global.peopleSetting;
      setFn = Global.setPeopleHaveList;
      sprites = this.rolesFrame;
    }
    const { current, haveList } = setting;
    const arr = this.shopItems.filter((item) => !haveList.includes(item));
    if (arr.length == 0) {
      console.log("不能抽奖了");

      return;
    }
    AudioMgr.ins.playSound(Clips.modal, 0.5);

    // const item = arr['9'];
    const item = arr[randomNum(0, arr.length - 1)];

    const propRoleOrCupModalView = await ResMgr.ins.getUI(
      ui.PropRoleOrCupModalView
    );
    const propRoleOrCupModalViewScript = propRoleOrCupModalView.getComponent(
      PropRoleOrCupModalView
    );
    setFn(this.tabIndex === Tab_Tag.CUP ? item : "C" + item);

    propRoleOrCupModalViewScript.setTitleImg(this.tabIndex);
    if (this.tabIndex === Tab_Tag.ROLE) propRoleOrCupModalViewScript.setScale(1.5)
    propRoleOrCupModalViewScript.cancelFn = () => {
      this.tabChange(this.tabIndex);
    };
    propRoleOrCupModalViewScript.setPropImg(sprites[+item - 1]);

    propRoleOrCupModalView.parent = this.node;
  }
  async randomProp() {
    // this.gainRewards()//TODO:
    super.showVideo(() => this.gainRewards());
  }
  // update (dt) {}
}
