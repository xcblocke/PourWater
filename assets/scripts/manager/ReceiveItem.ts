// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html
import { getPropNameByType } from "../com/index";
import { prop } from "../enum/Enums";
import { AccessType, TaskOneInfo } from "../interfaces/BaseInter";
import PropBlockMgr from "./PropBlockMgr";
import ResMgr from "./ResMgr";

const { ccclass, property } = cc._decorator;

@ccclass("SpriteGroup")
export class SpriteGroup {
  /**
   * 选中
   */
  @property(cc.SpriteFrame)
  select: cc.SpriteFrame = null;
  /**
   * 未选中
   */
  @property(cc.SpriteFrame)
  unselect: cc.SpriteFrame = null;
}
@ccclass
export default class ReceiveItem extends cc.Component {
  /** 视频 */
  @property({ type: SpriteGroup })
  video: SpriteGroup = null;
  /** 分享 */
  @property({ type: SpriteGroup })
  share: SpriteGroup = null;

  /** 道具块节点 */
  @property(cc.Node)
  propNode: cc.Node = null;

  /** 任务名称 */
  @property(cc.Label)
  taskName: cc.Label = null;

  /** 任务奖励 */
  @property(cc.Label)
  taskReward: cc.Label = null;

  /** 任务操作按钮 */
  @property(cc.Sprite)
  taskBtnSprite: cc.Sprite = null;

  // LIFE-CYCLE CALLBACKS:
  clickFn: Function = null;
  setClickFn(cb) {
    this.clickFn = cb;
  }
  // onLoad () {}
  /** 根据获取方式枚举获取对应的组 */
  getGroupByType(type: AccessType) {
    switch (type) {
      case AccessType.Video:
        return this.video;
      case AccessType.Share:
        return this.share;
      default:
        return null;
    }
  }
  /**
   *  设置任务信息
   * @param task 任务信息
   */
  async setTaskInfo(task: TaskOneInfo, state: 'unselect' | 'select' = 'unselect') {
    console.log(task.type, "type");

    let taskPre = await ResMgr.ins.getUI(prop[getPropNameByType(task.type)]);
    taskPre.getComponent(PropBlockMgr).labelShow = false;
    taskPre.parent = this.propNode;
    this.taskName.string = task.name;
    this.taskReward.string = `${getPropNameByType(task.type, true)}x${task.num
      }`;
    // this.taskBtnSprite.spriteFrame = this.getGroupByType(task.access).unselect;
    this.setBtnState(task, state);
    if (state === 'select') return

    let taskBtn = this.taskBtnSprite.node;
    taskBtn.once("click", () => {

      if (this.clickFn) {
        this.clickFn(() => this.setBtnState(task, 'select'));
      }
    });
  }
  setBtnState(task: TaskOneInfo, state: 'unselect' | 'select') {
    switch (state) {
      case 'unselect':
        this.taskBtnSprite.spriteFrame = this.getGroupByType(task.access).unselect;

        break;
      case 'select':
        this.taskBtnSprite.spriteFrame = this.getGroupByType(task.access).select;

        break;
      default:
        break;
    }
  }
  async start() {
    // getPropNameByType
    // let json = ResMgr.ins.getJson("task");
    // await this.init(json.json.data);
  }

  // update (dt) {}
}
