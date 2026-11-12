// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass("TabSpriteFrame")
export class TabSpriteFrame {
  @property(cc.SpriteFrame)
  default: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  check: cc.SpriteFrame = null;
}

@ccclass
export default class TabView extends cc.Component {
  @property([TabSpriteFrame])
  imgs: TabSpriteFrame[] = [];

  @property(cc.Integer) 
  currentIndex: Number = 0;
  @property(cc.Node)
  tabsLayout: cc.Node = null;
  // LIFE-CYCLE CALLBACKS:

  checkState(index: number) {
    if (this.currentIndex === index) return;
    this.currentIndex = index;
    const nodeList = this.tabsLayout.children;
    for (let i = 0; i < nodeList.length; i++) {
      const tabNode = nodeList[i];
      tabNode.getComponent(cc.Sprite).spriteFrame = this.imgs[i].default;
    }
    nodeList[index].getComponent(cc.Sprite).spriteFrame =
      this.imgs[index].check;
  }
  public tabCb:Function
  // onLoad () {}
  tabClick(e: cc.Event.EventTouch, index:string) {
    console.log(e, index);
    this.checkState(+index)
    if(this.tabCb)this.tabCb(index)
  }


  start() {}

  // update (dt) {}
}
