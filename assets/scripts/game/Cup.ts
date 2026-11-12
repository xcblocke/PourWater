//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html
import { rotatePt } from "../com/index";
import {
  AnimationTime,
  Clips,
  HEIGHT_FACTOR,
  PourAction, // 水的高度因子
  SPLIT_COUNT,
  TUBE_SELECTED_MOVE_HEIGHT, // 水的分割数量
  WaterColors, // 水的颜色 
  defaultColor, // 默认颜色 
} from "../enum/Enums"; // 引入枚举
import { _CupInfo, _CupTopInfo } from "../interfaces/BaseInter"; // 引入接口
import { AudioMgr } from "../manager/AudioMgr";
import Water from "./Water"; // 引入水的类

const { ccclass, property, executeInEditMode } = cc._decorator; // 引入装饰器

@ccclass("CupImgs")
export class CupImgs {
  @property(cc.SpriteFrame)
  tub: cc.SpriteFrame = null;
  @property(cc.SpriteFrame)
  mask: cc.SpriteFrame = null;
}

@ccclass
@executeInEditMode
export default class Cup extends cc.Component {
  /** 水的实例 */
  @property(Water)
  private water: Water = null; //
  /** 杯子的信息 */
  private info: _CupInfo = null; //

  @property(cc.Sprite)
  private tubeNode: cc.Sprite = null;
  @property(cc.Sprite)
  private maskNode: cc.Sprite = null;
  @property([CupImgs])
  private cupImgs: CupImgs[] = [];

  changeImg(index: number) {
    this.tubeNode.spriteFrame = this.cupImgs[index].tub;
    this.maskNode.spriteFrame = this.cupImgs[index].mask;
  }

  private _colors: string[] = [];
  private _default_color: string = "";
  setWaterColor(colors: string[] = WaterColors, default_color: string = defaultColor) {
    this._colors = colors;
    this._default_color = default_color;
  }
  onLoad() {
    this.setWaterColor()
  }
  /**
   * 初始化水
   */
  initWater() {
    /** 获取杯子的信息 */
    const info = this.info; //
    let arr = [];
    for (let i = SPLIT_COUNT - 1; i >= 0; i--) {
      // 从最后一个分割点开始遍历
      let colorId = info.colorIds[i]; // 获取当前分割点的颜色编号
      if (colorId == 0) {
        // 如果颜色编号为 0，表示没有水
        continue; // 跳过当前分割点
      }
      /** 获取数组中的最后一个对象 */
      let lastObj = arr[arr.length - 1]; //
      if (!lastObj || lastObj != colorId) {
        // 如果当前颜色与上一个颜色不同，则创建一个新的对象。
        arr.push({
          height: 1 / SPLIT_COUNT, // 设置高度
          colorId: colorId, // 设置颜色编号
        });
      } else {
        // 如果当前颜色与上一个颜色相同，则将上一个对象的高度增加 1 / SPLIT_COUNT。
        lastObj.height += 1 / SPLIT_COUNT;
      }
    }
    arr.forEach((obj) => {
      // 遍历数组
      let hex = this._colors[obj.colorId] || this._default_color; // 获取颜色的十六进制表示，如果没有则使用默认颜色
      obj.color = new cc.Color().fromHEX(hex); // 从十六进制颜色字符串中创建一个颜色对象。
      obj.height *= HEIGHT_FACTOR; // 将高度乘以高度因子
    });

    this.water.initInfos(arr); // 初始化水的信息
  }

  /**
   * 设置水信息
   * @param info 设置杯子的信息
   */
  setCupInfo(info: _CupInfo) {
    this.info = info; // 设置杯子的信息

    this.initWater(); // 初始化水
  }
  // 倒水结束
  // pourEnd(pourState: PourAction, cup: cc.Node) {
  //   if (pourState === PourAction.out) {
  //     this._upInfo = null;
  //     // if (this.node == cup) this.pourSameColor(2); // 倒掉相同颜色的水
  //     // this.backToInitPos(); // 动画回到初始位置
  //   }

  //   this.checked = false; // 设置选中状态为false
  // }

  update() {
    // 如果当前处于编辑器模式，则直接返回，不进行后续操作。
    if (CC_EDITOR) {
      return;
    }

    // 如果当前节点的旋转角度与水的 tiltAngle 属性值相同，则直接返回，不进行后续操作。
    if (this.water.tiltAngle == this.node.angle) {
      return;
    }

    // 将当前节点的旋转角度赋值给水的 tiltAngle 属性，以便在着色器中使用。
    this.water.tiltAngle = this.node.angle;
  }

  /**
   * 是否完成了（同颜色填满整个杯子）
   *  */
  checkIsFinshed() {
    /** 完成状态 */
    let finishedState = true; // 完成状态，默认为 true
    /** 颜色 */
    let colorIds = this.info.colorIds; // 获取颜色编号数组
    /** 颜色编号 */
    let tmpId = null; // 临时颜色编号
    /** 空数量 */
    let empTyNum = 0; // 空的分割点数量
    for (let i = 0; i < SPLIT_COUNT; i++) {
      // 遍历分割点
      if (tmpId == null) {
        // 如果临时颜色编号为 null，则将其设置为当前颜色编号
        tmpId = colorIds[i];
      }
      if (tmpId != colorIds[i]) {
        // 如果当前颜色编号与临时颜色编号不同，则表示未完成
        finishedState = false;
        break;
      } else if (colorIds[i] == 0) {
        // 如果当前颜色编号为 0，则表示当前分割点为空
        empTyNum++;
      }
    }
    if (empTyNum == SPLIT_COUNT) {
      // 如果所有分割点都为空，则表示已完成
      finishedState = true;
    }
    return finishedState; // 返回完成状态
  }

  setStartAddWater(colorId: number, num: number) {
    let acc = 0; // 计数器，记录已经添加的数量
    for (let i = SPLIT_COUNT - 1; i >= 0; i--) {
      // 从后往前遍历分割点
      if (this.info.colorIds[i] != 0) {
        // 如果当前分割点已经有颜色了，则跳过
        continue;
      }
      this.info.colorIds[i] = colorId; // 将颜色编号赋值给当前分割点
      if (++acc == num) {
        // 如果已经添加了指定数量的颜色，则跳出循环
        break;
      }
    }
  }
  /**
   * 开始添加水的方法
   * @param colorId  颜色编号
   * @param num 添加的数量
   */
  startAddWater(colorId: number, num: number) {
    let hex = this._colors[colorId] || this._default_color; // 获取颜色的十六进制表示，如果没有则使用默认颜色
    this.water.addInfo({
      // 调用水的实例的 addInfo 方法，添加水的信息
      colorId: colorId, // 颜色编号
      height: (num / SPLIT_COUNT) * HEIGHT_FACTOR, // 高度
      color: new cc.Color().fromHEX(hex), // 颜色
    });
    // UtilAudio.pourWater_effect_play(num / SPLIT_COUNT);
    AudioMgr.ins.playSoundAtTime(Clips.pourWater, num / SPLIT_COUNT);
  }

  private tween: cc.Tween = null;

  /**
   * 初始位置
   */
  private _orignPt: cc.Vec3 = null;
  get orignPt() {
    return this._orignPt;
  }

  setOrignPt(pt: cc.Vec3) {
    this._orignPt = pt;
  }

  /**
   * 设置倾倒水的锚点
   * @param isRight 是否从右侧倾倒水
   */
  public setPourAnchor(isRight: boolean) {
    // 创建一个向量表示锚点的位置(选一个靠上一点的位置)
    let pt = cc.v2(3, 2);
    // 如果从右侧倾倒水，则将锚点的 x 坐标设置为杯子宽度减去 3，否则保持不变
    pt.x = isRight ? this.node.width - pt.x : pt.x;
    // 将锚点的 y 坐标设置为杯子高度减去 2，以将其从杯子的顶部向下移动一些距离
    pt.y = this.node.height - pt.y;

    // 将锚点的 x 和 y 坐标分别除以杯子的宽度和高度，以将它们转换为相对于杯子节点的锚点坐标
    pt.x = pt.x / this.node.width;
    pt.y = pt.y / this.node.height;

    // 调用 setAnchor() 方法设置杯子节点的锚点
    this.setAnchor(pt);
  }

  /**
   * 设置锚点位置
   * @param anchor 锚点位置
   */
  private setAnchor(anchor: cc.Vec2): void {
    // 获取旧的锚点位置
    let oldAnchor = this.node.getAnchorPoint();
    // 获取当前节点的世界坐标
    let selfPt = this.node.getPosition();
    // 获取水的世界坐标
    let waterPt = this.water.node.getPosition();

    // 设置新的锚点位置
    this.node.setAnchorPoint(anchor);

    // 计算锚点位置的偏移量
    let offsetAnchor = cc.v2(anchor.x - oldAnchor.x, anchor.y - oldAnchor.y);
    // 计算偏移后的节点坐标
    let offsetPt = cc.v2(
      offsetAnchor.x * this.node.width,
      offsetAnchor.y * this.node.height
    );
    // 将偏移后的节点坐标旋转
    offsetPt = rotatePt(offsetPt, this.node.angle);
    // 更新节点的位置
    selfPt.x += offsetPt.x;
    selfPt.y += offsetPt.y;
    this.node.setPosition(selfPt);

    // 更新水的位置
    waterPt.x -= offsetAnchor.x * this.node.width;
    waterPt.y -= offsetAnchor.y * this.node.height;
    this.water.node.setPosition(waterPt);
  }

  /**
   * 移动杯子并倾倒水
   * Move the cup and pour out the water
   * @param dstPt 倾倒水的目标点
   * @param isRight 是否向右倾倒
   * @param num 倾倒的数量
   */
  moveToPour(dstPt: cc.Vec2, isRight: boolean, num: number) {
    let startAngle = this.water.getPourStartAngle(); // 获取倾倒开始时的角度
    let endAngle = this.water.getPourEndAngle(); // 获取倾倒结束时的角度
    this.water.onStartPour(num); // 开始倾倒水

    if (isRight) {
      startAngle *= -1; // 如果向右倾倒，则将开始角度取反
      endAngle *= -1; // 如果向右倾倒，则将结束角度取反
    }

    // this.setOrignPt(this.node.position); // 设置初始位置

    let moveDur = AnimationTime.moveTime; // 移动持续时间
    let pourDur = AnimationTime.pourTime; // 倾倒持续时间
    this.tween = cc
      .tween(this.node)
      .set({ angle: 0 }) // 设置初始角度为0
      .to(moveDur, { x: dstPt.x, y: dstPt.y, angle: startAngle }) // 移动到目标点并设置开始角度
      .to(pourDur, { angle: endAngle }) // 倾倒水并设置结束角度
      .call(() => {
        this.tween = null; // 动画完成后将tween设置为null
      })
      .start();
    this.pourSameColor(num);
  }

  // 动画回到初始位置
  backToInitPos() {
    if (this.tween) {
      // 如果当前正在播放动画，则停止动画
      this.tween.stop();
      this.tween = null;
    }
    this.tween = cc
      .tween(this.node)
      .to(AnimationTime.moveTime, { position: this._orignPt, angle: 0 }) // 回到初始位置
      .call(() => {
        this.tween = null; // 动画完成后将tween设置为null
        // this.changeCheckedState(); // 改变选中状态TODO:
      })
      .start();
  }

  private _upInfo: _CupTopInfo = null;
  get upCupInfo() {
    return this._upInfo;
  }
  /**
   * 倒掉相同颜色的水
   */
  pourSameColor(num: number) {
    let count = 0;
    let top = this.getTop(); // 获取杯子顶部的水
    let colorIds = this.info.colorIds; // 获取杯子中的颜色ID数组
    this._upInfo = JSON.parse(JSON.stringify(top));
    for (let i = 0; i < SPLIT_COUNT; i++) {
      let _id = colorIds[i];
      if (_id == 0) {
        // 如果颜色ID为0，则跳过
        continue;
      } else if (top.topColorId == _id) {
        // 如果顶部的颜色ID与当前颜色ID相同，则将当前颜色ID设置为0
        if (count++ == num) break;
        colorIds[i] = 0;
      } else {
        break; // 如果顶部的颜色ID与当前颜色ID不同，则跳出循环
      }
    }
  }

  /**
   * 获取杯子顶部的水
   * Get the top water of the cup
   */
  getTop(): _CupTopInfo {
    /** 获取杯子中的颜色ID数组 */
    let colorIds = this.info.colorIds; //
    /** 杯顶的空位有几格 */
    let emptyNum = 0; //
    /** 杯顶颜色id */
    let topColorId = 0; //
    /** 杯顶的颜色共有几格 */
    let topColorNum = 0; //
    for (let i = 0; i < SPLIT_COUNT; i++) {
      // 遍历颜色ID数组
      if (colorIds[i] == 0) {
        // 如果颜色ID为0，则表示该位置为空
        emptyNum++; // 空位数量加1
        continue;
      }
      if (topColorId == 0 || topColorId == colorIds[i]) {
        // 如果杯顶颜色ID为0或者与当前颜色ID相同
        topColorId = colorIds[i]; // 将杯顶颜色ID设置为当前颜色ID
        topColorNum++; // 杯顶颜色数量加1
      } else {
        break; // 如果杯顶颜色ID与当前颜色ID不同，则跳出循环
      }
    }
    return {
      /** 返回空位数量 */
      emptyNum: emptyNum, //
      /** 返回杯顶颜色ID */
      topColorId: topColorId, //
      /** 返回杯顶颜色数量 */
      topColorNum, //
      /** 返回杯顶颜色的十六进制表示，如果颜色ID无效，则返回默认颜色 */
      colorHex: this._colors[topColorId] || this._default_color //
    };
  }

  // 获取瓶口的中心位置
  getBottleMouthCenter() {
    // 局部坐标转世界坐标
    // let pos = this.node.convertToWorldSpaceAR(
    //   cc.v2(this.node.width / 2, this.node.height)
    // );
    return {
      x: this.node.x,
      y: this.node.y + this.node.width / 2,
    };
    // 世界坐标转局部坐标
  }

  /**
   * 选中状态
   */
  checked: boolean;
  private onClick: (c: Cup) => void = null;

  setOnClick(onClick: (c: Cup) => void) {
    this.onClick = onClick;
  }

  /**
   * 改变选中状态
   * @param _event
   * @param state
   */
  public changeCheckedState() {
    if (this.isPouring()) {
      return;
    }
    if (this.onClick) {
      this.onClick(this);
    }
  }

  /**
   * 检查杯子当前是否正在倾倒
   * @returns {boolean} 如果杯子正在倾倒，则为true，否则为false
   */
  public isPouring() {
    return Math.abs(this.node.angle) > 1.0;
  }

  /**
   * 获取当前水面的global y坐标 */
  getWaterSurfacePosY(needAdjust = false) {
    let top = this.getTop();
    let y = (SPLIT_COUNT - top.emptyNum) / SPLIT_COUNT;
    if (y < 0.02) {
      y = 0.02;
    } else if (needAdjust) {
      y -= (1.0 / SPLIT_COUNT) * HEIGHT_FACTOR;
    }
    y *= HEIGHT_FACTOR;
    y -= 0.5;
    let pt = cc.v2(0, this.water.node.height * y);
    pt = this.water.node.convertToWorldSpaceAR(pt);
    return pt.y;
  }

  /**
   * 倒水结束回调
   * @param onFinish 倒水结束回调
   */
  setPourInCallback(onFinish: (cup: Cup, isFInish: boolean) => void) {
    //水倒完了
    const _onFinish = () => {
      this._upInfo = null;
      let isFinished = this.checkIsFinshed();
      // cc.log("-----------isFinished",isFinished)
      if (onFinish) {
        onFinish(this, isFinished);
      }
      if (isFinished) {
        AudioMgr.ins.playSound(Clips.ContainerFinish, 0.3);
      }
    };
    this.water.setPourInCallback(_onFinish.bind(this));
  }

  /**
   * 倒水开始回调
   */
  setPourOutCallback(pourStart: (c: Cup) => void, pourEnd: (c: Cup) => void) {
    //水开始从瓶口流出来
    const _onStart = function () {
      if (pourStart) {
        pourStart(this);
      }
    };
    //水倒完了
    const _onFinish = function () {
      if (this.tween) {
        this.tween.stop();
        this.tween = null;
      }
      if (pourEnd) {
        pourEnd(this);
      }
    };
    this.water.setPourOutCallback(_onStart.bind(this), _onFinish.bind(this));
  }

  public setNormalAnchor() {
    this.setAnchor(cc.v2(0.5, 0.5));
  }

  /**
   * 立刻向杯子中添加水
   * @param colorId 颜色编号
   * @param num 添加的水的数量
   */
  addWaterImmediately(colorId: number, num: number) {
    let acc = 0;
    // 从后往前遍历 colorIds 数组
    for (let i = SPLIT_COUNT - 1; i >= 0; i--) {
      // 如果当前位置已经有颜色，则跳过
      if (this.info.colorIds[i] != 0) {
        continue;
      }
      // 否则将当前位置的颜色设置为 colorId
      this.info.colorIds[i] = colorId;
      // 如果已经添加了 num 滴水，则退出循环
      if (++acc == num) {
        break;
      }
    }
    // 初始化水的状态
    this.initWater();
  }

  /**
   * 立刻从杯子中移除水
   * @param num 移除的水的数量
   * @returns 移除的水的信息
   */
  removeTopWaterImmediately(num: number) {
    let acc = 0;
    // 获取杯子中最上面的水
    let top = this.getTop();
    let colorIds = this.info.colorIds;
    // 从前往后遍历 colorIds 数组
    for (let i = 0; i < SPLIT_COUNT; i++) {
      let _id = colorIds[i];
      // 如果当前位置没有颜色，则跳过
      if (_id == 0) {
        continue;
        // 如果当前位置的颜色与最上面的水的颜色相同，则将当前位置的颜色设置为 0
      } else if (top.topColorId == _id) {
        colorIds[i] = 0;
        // 如果已经移除了 num 滴水，则退出循环
        if (++acc >= num) {
          break;
        }
      } else {
        break;
      }
    }
    // 初始化水的状态
    this.initWater();
    return top;
  }
}
