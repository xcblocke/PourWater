// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../Global";
import { DyRecorderManager } from "../ad/DyRecorderManager";
import { AnimationTime, SPLIT_COUNT, events, spacesArr } from "../enum/Enums";
import Cup from "../game/Cup";
import { WaterFlow } from "../game/WaterFlow";
import {
  Action,
  CupManager,
  SpacesArr,
  _CupInfo,
  _CupTopInfo,
  _SelectCupInfo,
} from "../interfaces/BaseInter";

const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class CupMgr extends cc.Component {
  @property(cc.Prefab)
  cupPrefab: cc.Prefab = null;

  @property(cc.JsonAsset)
  protected levelCfg: cc.JsonAsset = null;

  @property private _debugLevel: number = 0;
  @property({ tooltip: CC_DEV && "调试关卡" })
  public get debugLevel() {
    return this._debugLevel;
  }

  public set debugLevel(value: number) {
    this._debugLevel = value;
    Global.setLv(value);
    this.nextLevel();
  }

  /**
   * 动画播放状态
   */
  private _isPlaying: boolean = false;
  private _waterFlow: WaterFlow = null;
  onLoad() {
    if (CC_EDITOR) {
      return;
    }
    this.nextLevel();
    let _node = new cc.Node();
    _node.parent = this.node;
    this._waterFlow = _node.addComponent(WaterFlow);
  }

  /** 当前选中的杯子 */
  private selectedCup: Cup = null;
  /**
   * 处理杯子点击事件
   * @param {Cup} cup 被点击的杯子
   */
  private onClickCup(cup: Cup) {
    if (this.selectedCup) {
      // 如果已经选中了一个杯子
      if (this.selectedCup == cup) {
        // 如果再次点击了同一个杯子
        this.doSelect(cup, false); // 取消选中
        this.selectedCup = null; // 重置选中状态
      } else if (this.checkPour(this.selectedCup, cup)) {
        // 如果两个杯子可以倾倒
        this.startPour(this.selectedCup, cup); // 开始倾倒
      } else {
        // 如果两个杯子不能倾倒
        this.doSelect(this.selectedCup, false); // 取消选中之前选中的杯子
        this.selectedCup = null; // 重置选中状态
      }
    } else {
      // 如果没有选中的杯子
      this.selectedCup = cup; // 选中当前杯子
      this.doSelect(cup, true); // 选中当前杯子
    }
  }
  /**
   * 选中或取消选中杯子
   * @param {Cup} cup 要选中或取消选中的杯子
   * @param {boolean} bool 是否选中
   */
  private doSelect(cup: Cup, bool: boolean) {
    let pt = cup.orignPt; // 获取杯子的原始位置
    let y = pt.y + (bool ? cup.node.height * AnimationTime.moveTime : 0); // 计算杯子的新位置
    cc.tween(cup.node).stop(); // 停止之前的动画
    cc.tween(cup.node).to(AnimationTime.moveTime, { y: y }).start(); // 播放新的动画
  }
  // oneCheckInfo: _CupTopInfo;
  /**
   * 开始倒水
   * @param src 选中的杯子
   * @param dst 当前杯子
   */
  private startPour(src: Cup, dst: Cup) {
    let dstPt = cc.v2(dst.node.position);
    /** 将目标杯子的位置转换为世界坐标 */
    let dstGlobal = dst.node.parent.convertToWorldSpaceAR(dstPt);
    /** 获取屏幕可视区域的尺寸*/
    let viewSize = cc.view.getVisibleSize();
    /** 标记目标是否在屏幕右侧 */
    let isRight = dstGlobal.x > viewSize.width * 0.5; //

    let srcTop = JSON.parse(JSON.stringify(src.getTop()));
    // this.oneCheckInfo = JSON.parse(JSON.stringify(src.getTop()));
    /** 计算倒水的数量 */
    let pourNum = Math.min(srcTop.topColorNum, dst.getTop().emptyNum);

    let pour = this.pourLiquid(src, dst, {
      dstPt,
      dstGlobal,
      viewSize,
      isRight,
    });
    dstPt = pour.dstPt;
    isRight = pour.isRight;
    this.selectedCup = null;

    // let dstMouthCenter = dst.getBottleMouthCenter();
    this._isPlaying = true;
    src.moveToPour(
      // new cc.Vec2(dstMouthCenter.x, dstMouthCenter.y),
      dstPt,
      isRight,
      pourNum
    );
    src.setPourOutCallback(
      () => this.onPourStart(src, dst, srcTop),
      () => this.onPourFinish(src, dst, this._waterFlow)
    );

  }
  /**
   * 倾倒完成回调函数
   * @param {Cup} src 倾倒源杯子
   * @param {Cup} dst 倾倒目标杯子
   * @param {WaterFlow} flow 水流对象
   */
  onPourFinish(src: Cup, dst: Cup, flow: WaterFlow) {
    let startPt = src.node.convertToWorldSpaceAR(cc.v2()); // 获取源杯子的世界坐标
    startPt = flow.node.parent.convertToNodeSpaceAR(startPt); // 将源杯子的世界坐标转换为水流节点的本地坐标
    let endPt = cc.v2(startPt.x, dst.getWaterSurfacePosY(true)); // 获取目标杯子的水面高度
    endPt = flow.node.parent.convertToNodeSpaceAR(endPt); // 将目标杯子的世界坐标转换为水流节点的本地坐标
    endPt.x = startPt.x; // 设置水流的起始和结束位置
    flow.playFlowAni(startPt, endPt, AnimationTime.moveTime, true, () => {
      // 播放水流动画
      flow.clear(); // 清除水流
    });
    src.setNormalAnchor(); // 设置源杯子的锚点
    let pt = src.orignPt; // 获取源杯子的原始位置
    let moveBack = cc
      .tween(src.node)
      // .delay(0.1)
      .to(
        AnimationTime.moveTime,
        { x: pt.x, y: pt.y, angle: 0 },
        { easing: "sineOut" }
      ) // 将源杯子移回原始位置
      .call(() => {
        src.node.zIndex = 0; // 设置源杯子的zIndex
        src.node.parent.zIndex = 0; // 设置源杯子的父节点的zIndex
      });
    moveBack.start(); // 播放移动动画
  }
  /**
   *  检查是否可以倒水
   * @param src 选中的杯子
   * @param dst 当前杯子
   * @returns 是否可以倒水
   */
  private checkPour(src: Cup, dst: Cup) {
    const { topColorId: srcColorId, topColorNum: srcColorNum } = src.getTop();
    const { topColorId: dstColorId, emptyNum: dstEmptyNum } = dst.getTop();
    // 如果源杯子没有颜色或目标杯子已有颜色且颜色不同，返回 false
    if (!srcColorId || (dstColorId && dstColorId !== srcColorId)) {
      return false;
    }

    // 如果源杯子的颜色数量大于目标杯子的空位数量，返回 false
    if (!dstEmptyNum) {
      return false;
    }

    // 否则返回 true
    return true;
  }
  /**
   * 创建杯子节点，并添加到当前节点上
   * @param info 杯子信息
   * @returns 新创建的杯子组件
   */
  createCupNode(info: _CupInfo) {
    const { current } = Global.cupSetting;
    // 创建一个新节点
    const cup = cc.instantiate(this.cupPrefab);
    const cupComp = cup.getComponent(Cup);
    cupComp.changeImg(+current - 1);
    // 将新节点添加到当前节点
    this.node.addChild(cup);
    // 获取杯子组件

    // 设置杯子的信息
    cupComp.setCupInfo(info);
    // 设置杯子的信息和点击回调函数
    cupComp.setOnClick(this.onClickCup.bind(this, cupComp));
    // 返回杯子组件
    return cupComp;
  }

  /**
   * 初始化关卡配置
   */
  protected initCfg(_lv?:number) {
    this.curCfg = [];
    let cfgArr: Array<number> = this.levelCfg.json[Global.lv - 1]; //每一关的数据，都是数组，每四个数字代表一杯水 
    let acc = 0;
    while (acc < cfgArr.length) {
      let info = {
        colorIds: [
          cfgArr[acc],
          cfgArr[acc + 1] || 0,
          cfgArr[acc + 2] || 0,
          cfgArr[acc + 3] || 0,
        ],
      };
      this.curCfg.push(info);
      acc += 4;
    }
  }
  /**
   * 创建一个指定类型的布局组件，并将其添加到指定节点上
   * @param type 布局类型
   * @param parent 父节点
   * @param name 节点名称
   * @returns 新创建的布局组件
   */
  _createLayout(type: cc.Layout.Type, parent: cc.Node, name?: string) {
    // 创建一个新节点
    let node = new cc.Node(name);
    // 将新节点添加到父节点上
    node.parent = parent;
    // 在新节点上添加布局组件
    let layout = node.addComponent(cc.Layout);
    // 设置布局类型
    layout.type = type;
    // 设置布局的 resize mode
    layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
    // 返回新创建的布局组件
    return layout;
  }

  /**
   *  倒水
   * @param src 源杯子
   * @param dst 目标杯子
   */
  private pourLiquid(
    src: Cup,
    dst: Cup,
    { dstPt, dstGlobal, viewSize, isRight }: CupManager
  ) {
    // 调整节点的层级关系
    dst.node.zIndex = 0;
    dst.node.parent.zIndex = 0;
    src.node.zIndex = 10;
    src.node.parent.zIndex = 10;

    // 计算目标位置
    if (Math.abs(dstGlobal.x - viewSize.width * 0.5) < 2) {
      //目标在中间
      let srcPt = src.node.parent.convertToWorldSpaceAR(
        cc.v2(src.node.position)
      );
      isRight = srcPt.x < viewSize.width * 0.5;
    }
    // dstPt.y += 20;
    dstPt.y += 30 + dst.node.height * 0.5;
    let offsetX = 0; //dst.node.width*0.5-20;
    dstPt.x = dstPt.x + (isRight ? -offsetX : offsetX);

    dstPt = dst.node.parent.convertToWorldSpaceAR(dstPt);

    //将瓶口设置为锚点
    src.setPourAnchor(isRight);
    dstPt = src.node.parent.convertToNodeSpaceAR(dstPt);
    return { dstPt, isRight };
  }
  /**
   * 倒水开始
   * @param src 源杯子
   * @param dst 目标杯子
   */
  onPourStart(src: Cup, dst: Cup, srcTop: _CupTopInfo) {
    // let srcTop = src.getTop(); // 获取源杯子的顶部
    const flow = this._waterFlow; // 获取水流对象
    flow.setLineScale(this.layout_v.node.scale); // 设置水流的线条缩放比例
    let startPt = src.node.convertToWorldSpaceAR(cc.v2()); // 获取源杯子的世界坐标
    startPt = flow.node.parent.convertToNodeSpaceAR(startPt); // 将源杯子的世界坐标转换为水流节点的本地坐标
    let endPt = cc.v2(startPt.x, dst.getWaterSurfacePosY()); // 获取目标杯子的水面高度
    endPt = flow.node.parent.convertToNodeSpaceAR(endPt); // 将目标杯子的世界坐标转换为水流节点的本地坐标
    endPt.x = startPt.x; // 设置水流的起始和结束位置

    flow.strokeColor = new cc.Color().fromHEX(srcTop.colorHex); // 设置水流的颜色
    let pourNum = Math.min(srcTop.topColorNum, dst.getTop().emptyNum);

    const finishFn = (cup: Cup, isFinished: boolean) => {
      this._isPlaying = false;
      this.onPourOneFinished(src, dst, srcTop.topColorId, pourNum);
    };
    dst.setStartAddWater(srcTop.topColorId, pourNum);
    flow.playFlowAni(startPt, endPt, AnimationTime.moveTime, false, () => {
      dst.setPourInCallback(finishFn);
      dst.startAddWater(srcTop.topColorId, pourNum);
    });
  }

  // private _actions: Array<Action> = Global.action_list;
  /**一次倒水完成（以加水那个杯子水面升到最高为界限） */
  private onPourOneFinished(from: Cup, to: Cup, colorId: number, num: number) {
    let fromCupIdx = this._cups.indexOf(from);
    let toCupIdx = this._cups.indexOf(to);
    if (Global.action_list.length == Global.action_step) {
      Global.action_list.shift();
    }
    Global.action_list.push({
      from: fromCupIdx,
      to: toCupIdx,
      colorId: colorId,
      num: num,
    });
    // cc.sys.localStorage.setItem(COOKIE_LAST_CFG, JSON.stringify(this.curCfg));
    // cc.sys.localStorage.setItem(
    //   COOKIE_ACTION_HISTORY,
    //   JSON.stringify(Global.action_list)
    // );
    let isAllFinished = this.checkIsAllFinished();
    if (isAllFinished) {

      // Global.lv++;
      // cc.sys.localStorage.setItem(COOKIE_LEVEL, Global.lv);
      cc.director.emit(events.LevelFinish);
    } else {

      cc.director.emit(events.Do_pour);
    }
  }
  /**
   * 检查是否全部完成
   * @returns 是否全部完成
   */
  private checkIsAllFinished() {
    for (let cup of this._cups) {
      if (!cup.checkIsFinshed()) {
        return false;
      }
    }
    return true;
  }
  /**
   * 创建杯子布局，并添加到当前节点上
   */
  private layout_v: cc.Layout = null;
  /**
   * 当前关卡的杯子信息数组
   */
  private _cups: Array<Cup> = [];
  /**
   * 当前关卡的杯子信息数组
   */
  protected curCfg: Array<_CupInfo> = [];

  /**
   * 创建杯子布局，并添加到当前节点上
   */
  async createCups() {
    // 销毁垂直布局节点的所有子节点
    if (this.layout_v) {
      this.layout_v.node.destroyAllChildren();
    }

    this._cups = [];
    const len = this.curCfg.length;
    // 如果杯子数量为0，则直接返回
    if (len == 0) {
      return;
    }
    // 遍历杯子信息数组
    for (let i = 0; i < len; i++) {
      let info = this.curCfg[i];
      // 创建杯子节点，并添加到当前节点上
      let cup = this.createCupNode(info);
      // 将杯子组件添加到杯子数组中
      this._cups.push(cup);
    }

    if (!this.layout_v) {
      // 创建一个垂直布局组件，并添加到当前节点上
      this.layout_v = this._createLayout(
        cc.Layout.Type.VERTICAL,
        this.node,
        "layout_v"
      );
      //  设置布局的对齐方式
      this.layout_v.node.zIndex = 1;
    }

    let layoutArr: Array<cc.Layout> = [];
    // 创建杯子索引分组
    let cupIdxGroups = this.createCupIndexGroups(len);
    // 计算最大杯子数量
    let maxNum = 1;
    for (let i = 0; i < cupIdxGroups.length; i++) {
      let idGroup = cupIdxGroups[i];
      let layout = this.createCupLayout(
        cupIdxGroups,
        this._cups[0].node.getContentSize(),
        maxNum,
        spacesArr,
        i
      );
      maxNum = Math.max(maxNum, idGroup.length);
      // layout.enabled = false;
      layoutArr.push(layout);
    }

    // layout.node.parent = this.layout_v.node;

    // layout.enabled = false;
    this.layout_v.enabled = true;
    this.layout_v.node.scale = spacesArr[maxNum][1];
    this.layout_v.spacingY = spacesArr[maxNum][2] || 40;

    for (let layout of layoutArr) {
      layout.updateLayout();
      layout.enabled = false;
    }
    this.layout_v.updateLayout();
    this.layout_v.enabled = false;
    // 保存杯子的原始位置
    for (let cup of this._cups) {
      cup.setOrignPt(cup.node.position);
    }
  }
  /**
   * 创建杯子布局，并添加到当前节点上
   * @param len 杯子数量
   * @returns 杯子索引分组
   */
  createCupIndexGroups(len: number) {
    let cupIdxGroups: Array<Array<number>> = [];
    if (len <= 4) {
      // 如果杯子数量不超过 4，将所有杯子放在同一组中。
      let idGroup: Array<number> = [];
      for (let i = 0; i < this._cups.length; i++) {
        idGroup.push(i);
      }
      cupIdxGroups.push(idGroup);
    } else if (len <= 15) {
      // 如果杯子数量不超过 15，将杯子分成两组，每组数量尽量相等。
      let idGroup: Array<number> = [];
      let i = 0;
      let middleId = len / 2;
      for (; i < middleId; i++) {
        idGroup.push(i);
      }
      cupIdxGroups.push(idGroup);
      idGroup = [];

      for (; i < len; i++) {
        idGroup.push(i);
      }
      cupIdxGroups.push(idGroup);
      idGroup = [];
    }
    return cupIdxGroups;
  }

  /**
   * 创建杯子布局，并添加到当前节点上
   * @param cupIdxGroups 杯子索引分组
   * @param cupSize 杯子尺寸
   * @param maxNum 最大杯子数量
   * @param spacesArr 杯子间距数组
   * @returns 新创建的杯子布局组件
   */
  createCupLayout(
    cupIdxGroups: Array<Array<number>>,
    cupSize: cc.Size,
    maxNum: number,
    spacesArr: SpacesArr,
    index: number = 0
  ) {
    let layout = this._createLayout(
      cc.Layout.Type.HORIZONTAL,
      this.layout_v.node,
      `layout_h_${index}`
    );
    // 设置布局的尺寸
    layout.node.height = cupSize.height;

    // 设置布局的间距
    layout.spacingX = spacesArr[maxNum][0];
    // 设置布局的缩放
    layout.node.scale = 1 || spacesArr[maxNum][1];
    // 设置布局的垂直间距
    layout.spacingY = spacesArr[maxNum][2] || 40;
    // 遍历杯子索引分组
    // for (let i = 0; i < cupIdxGroups.length; i++) {
    let idGroup = cupIdxGroups[index];
    // 遍历杯子索引
    for (let j = 0; j < idGroup.length; j++) {
      let id = idGroup[j];
      // 将杯子节点添加到布局节点上
      this._cups[id].node.parent = layout.node;
    }
    // }
    // 返回新创建的杯子布局组件
    return layout;
  }
  public static ins: CupMgr = null;

  protected start(): void {
    CupMgr.ins = this;
    cc.director.on(events.Reset, this.resetLv, this);
    cc.director.on(events.Back, this.undoAction, this);
    cc.director.on(events.Next, this.nextLevel, this);
    cc.director.on(events.AddTube, this.addcur, this);
  }
  protected onDisable(): void {
    cc.director.off(events.Reset, this.resetLv, this);
    cc.director.off(events.Back, this.undoAction, this);
    cc.director.off(events.Next, this.nextLevel, this);
    cc.director.off(events.AddTube, this.addcur, this);
  }
  private resetLv() {
    Global.action_list = [];
    this.nextLevel();
  }
  /**
   * 进入下一关
   */
  public nextLevel() {
    DyRecorderManager.ins.start()
    console.log('开始');
    
    Global.action_list = [];
    if (this._isPlaying) return;
    // 初始化配置
    this.initCfg();
    // 创建水杯
    this.createCups();
    if (Global.lv === 1) {
      setTimeout(() => {
        cc.systemEvent.emit(events.ExcuteGuideTask, {
          taskFlie: 'GuideTask',
          stepIndex: 0
        })
      }, 300);
    }
  }

  /**
   * 撤销操作
   * @param fn 回调函数
   * @returns 是否撤销成功
   */
  public async undoAction(fn?: Function) {
    // 如果正在播放动画或者没有可撤销的操作，则直接返回
    if (!this.checkCanUndo()) {
      return;
    }
    // 如果有回调函数，则执行回调函数
    if (fn) {
      if (!fn()) return false;
    }
    // 取出最后一个操作
    let action = Global.action_list.pop();
    if (action == null) {
      return false;
    }

    // 获取操作的来源杯和目标杯
    let { from, to, num, colorId } = action;
    let toCup = this._cups[to];
    let fromCup = this._cups[from];

    // 如果目标杯或来源杯正在倒水，则直接返回
    if (toCup.isPouring() || fromCup.isPouring()) {
      return false;
    }

    // 将水从目标杯中移除，将水加入来源杯中
    toCup.removeTopWaterImmediately(num);
    fromCup.addWaterImmediately(colorId, num);
    return true;
  }

  /**
   * 添加试管
   */
  addcur() {
    if (!this.checkCanAddTube()) return;
    if (this.selectedCup) {
      this.doSelect(this.selectedCup, false); // 取消选中
      this.selectedCup = null; // 重置选中状态
    }
    this._waterFlow.clear();
    this.curCfg.push({ colorIds: [0, 0, 0, 0] });
    this.createCups();
  }
  /**
   * 判断是否能撤销
   */
  public checkCanUndo() {
    return !this._isPlaying && Global.action_list.length > 0;
  }
  /**
   * 判断是否能加管
   */
  public checkCanAddTube() {
    return !this._isPlaying && this.curCfg.length < Global.maxTube;
  }
  // update (dt) {}
}
