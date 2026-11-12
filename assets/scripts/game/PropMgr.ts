/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-08-12 23:29:55
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-08-13 11:10:33
 * @FilePath: \倒水游戏重构\assets\scripts\game\PropMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

// 状态 视频 分享,默认
export enum PropState {
  //   None = 0,
  Video = 1,
  Share = 2,
}

@ccclass
export default class PropMgr extends cc.Component {
  @property(cc.Node)
  videoNode: cc.Node = null;

  @property(cc.Node)
  shareNode: cc.Node = null;

  @property(cc.Node)
  numNode: cc.Node = null;

  private num: number = 0;
  private state: PropState = PropState.Video;

  setNum(num: number) {
    this.num = num;
    this.showNodeByState();
  }
  showNodeByState() {
    if (this.num > 0) {
      this.numNode.active = true;
      this.numNode.getComponent(cc.Label).string = this.num.toString();
      this.videoNode.active = false;
      this.shareNode.active = false;
    } else {
      this.numNode.active = false;
      if (this.state == PropState.Video) {
        this.videoNode.active = true;
        this.shareNode.active = false;
      } else {
        this.videoNode.active = false;
        this.shareNode.active = true;
      }
    }
  }
  setState(state: PropState) {
    this.state = state;
  }
  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {}

  // update (dt) {}
}
