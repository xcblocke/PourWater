//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html
import { radian2angle } from "../com/index";
import {
  ANGLE_FACTOR,
  BASIC_DATA,
  HEIGHT_FACTOR,
  MAX_ARR_LEN,
  PourAction,
  SPLIT_COUNT,
  WaterInfo,
} from "../enum/Enums";

const {
  ccclass,
  property,
  requireComponent,
  executeInEditMode,
  disallowMultiple,
  executionOrder,
} = cc._decorator;
/**  */

@ccclass
// 指定组件可以在编辑器模式下运行，使其可以在Cocos Creator的场景编辑器中实时预览效果。
@executeInEditMode
export default class Water extends cc.Component {
  /**节点高宽比 */
  private _ratio: number = 1;
  @property(cc.EffectAsset)
  private effect: cc.EffectAsset = null;
  @property private _tiltAngle: number = 0;
  @property({ tooltip: CC_DEV && "旋转角度" })
  // 获取倾斜角度
  public get tiltAngle() {
    return this._tiltAngle;
  }
  /**
   * 设置倾斜角度
   */
  public set tiltAngle(value: number) {
    // 这个操作常用于保留小数点后几位，以达到精度控制的目的。
    value = Math.round(value * 100) / 100;
    // cc.log("angle",value)
    this._tiltAngle = value;
    // 更新倾斜角度对应的高度
    this.updateAngleHeight();
  }
  // 材质
  private material: cc.Material = null;
  /** 当前倒水的动作 */
  private _action: PourAction = PourAction.none;
  /** 存储每层水的信息 */
  private infos: WaterInfo[] = [];
  /**到这里停止倒水 */
  private stopIdx = -1;
  /**当前是有几层水 */
  private curIdx = 0;
  private _actionHeight = 0;
  /** 操作的高度，状态为PourAction.in(加水的时候)是当前格子增加(多少),为PourAction.out(减水的时候)是减少到多少 */
  public get actionHeight() {
    return this._actionHeight;
  }
  public set actionHeight(value) {
    if (value > HEIGHT_FACTOR) {
      value = HEIGHT_FACTOR;
      // throw new Error(`倒水高度不能大于${HEIGHT_FACTOR}`);
    }
    if (value < 0) {
      // value = 0;
      throw new Error(`倒水高度不能小于0`);
    }
    this._actionHeight = value;
  }

  // /** 档位 */
  // gear_pos: number[] = [];
  /** 切换状态 */
  public changeAction(action: PourAction) {
    this._action = action;
  }
  /**
   *  添加水层
   *
   * @param info 添加水层信息
   */
  public addInfo(info: WaterInfo) {
    let upActionHeight = this.actionHeight;
    
    this.actionHeight = info.height;
    // 将当前水层高度置空，为了在动画里加上
    info.height = 0;
    // 改变当前状态
    let curInfo = this.infos[this.curIdx];
    if (this._action === PourAction.in) {
      this.actionHeight += upActionHeight - (curInfo?.height || 0);
    }
    this._action = PourAction.in;
    //判断颜色相同高度相加
    if (curInfo && curInfo.colorId == info.colorId) {
      this.actionHeight += curInfo.height;
      
    } else {
      // 将水层信息添加到数组中
      this.infos.push(info);
    }
    // 将当前索引设置为最后一个水层的索引
    this.curIdx = this.infos.length - 1;
    
    this.initSizeColor();
  }
  protected onLoad() {
    // // 档位计算
    // this.gear_pos = [
    //   HEIGHT_FACTOR / 4,
    //   HEIGHT_FACTOR / 2,
    //   (HEIGHT_FACTOR / 4) * 3,
    //   HEIGHT_FACTOR,
    // ];
    // 获取节点上的 Sprite 组件
    let sp = this.node.getComponent(cc.Sprite);
    // 如果 Sprite 组件上有 spriteFrame，则将其纹理设置为不可打包
    if (sp.spriteFrame) sp.spriteFrame.getTexture().packable = false;
    // 生成并应用材质
    if (this.effect) {
      this.material = cc.Material.create(this.effect);
      sp.setMaterial(0, this.material);
    }
    // 获取材质
    this.material = sp.getMaterial(0);
    // 获取节点的高宽比
    this._ratio = this.node.height / this.node.width;
  }
  /**
   * 初始化水层信息
   * @param infos 水层信息
   */
  public initInfos(infos: Array<WaterInfo>) {
    // 将传入的水层信息赋值给当前组件的 infos 属性
    this.infos = this.waterHandle(infos);

    // 将当前索引设置为最后一个水层的索引
    this.curIdx = this.infos.length - 1;

    this.initSizeColor();
    this.updateAngleHeight();
  }
  /**
   * 处理水层信息
   * @param infos 水层信息
   * @returns
   */
  public waterHandle(infos: Array<WaterInfo>) {
    let _infos = [];
    for (let i = 0; i < infos.length; i++) {
      const info = infos[i];
      if (
        _infos[_infos.length - 1] &&
        _infos[_infos.length - 1].colorId == info.colorId
      ) {
        _infos[_infos.length - 1].height += info.height;
      } else {
        _infos.push(info);
      }
    }
    return _infos;
  }
  /**
   *  初始化水层的大小和颜色
   */
  private initSizeColor() {
    // 创建一个长度为MAX_ARR_LEN * 4 的 Float32Array 数组
    let _colors = new Float32Array(MAX_ARR_LEN * BASIC_DATA.BYTE); //数组只支持一维数组
    for (let i = 0; i < this.infos.length; i++) {
      const color = this.infos[i].color;
      _colors[i * BASIC_DATA.BYTE] = color.r / BASIC_DATA.color_range;
      _colors[i * BASIC_DATA.BYTE + BASIC_DATA.color_alpha2] =
        color.g / BASIC_DATA.color_range;
      _colors[i * BASIC_DATA.BYTE + BASIC_DATA.color_alpha3] =
        color.b / BASIC_DATA.color_range;
      _colors[i * BASIC_DATA.BYTE + BASIC_DATA.color_alpha4] =
        BASIC_DATA.color_alpha;
    }
    // 将 _colors 数组作为材质的 colors 属性值进行设置，以便在着色器中使用。由于数组只支持一维数组，因此需要将 _colors 数组转换为一维数组后再进行设置。
    this.material.setProperty("colors", _colors);

    // 将节点的宽高作为材质的 iResult 属性值进行设置，以便在着色器中使用。这里使用 cc.v2 方法将节点的宽高封装为一个 Vec2 对象，方便进行属性设置。
    this.material.setProperty(
      "iResult",
      cc.v2(this.node.width, this.node.height)
    );

    // 将 corrugationType 属性值设置为 0，以便在着色器中使用。这个属性值的具体含义需要根据着色器的实现来确定。（波纹类型）
    this.material.setProperty("corrugationType", PourAction.none);
  }
  /**
   * 更新水面的倾斜效果
   */
  private updateAngleHeight() {
    let _heights = new Float32Array(MAX_ARR_LEN * BASIC_DATA.BYTE);
    for (let i = 0; i < this.infos.length; i++) {
      _heights[i * BASIC_DATA.BYTE] = this.infos[i].height;
    }
    // 将 _heights 数组作为材质的 heights 属性值进行设置，以便在着色器中使用。由于数组只支持一维数组，因此需要将 _heights 数组转换为一维数组后再进行设置。
    this.material.setProperty("heights", _heights);

    // 将 this._tiltAngle 属性值作为材质的 tiltAngle 属性值进行设置，以便在着色器中使用。
    this.material.setProperty("tiltAngle", this._tiltAngle);

    // 根据 this._action 属性值的不同，将 corrugationType 属性值设置为不同的值。
    let corrugationType = PourAction.none;
    if (this._action == PourAction.in) {
      corrugationType = PourAction.in;
    } else if (this._action == PourAction.out) {
      corrugationType = PourAction.out;
    }
    // 设置波纹类型
    this.material.setProperty("corrugationType", corrugationType);
  }
  /**
   * 增加水面高度
   * @returns
   */
  public upHeight() {
    if (this.isFull()) {
      this.actionHeight = 0;
      this._action = PourAction.none;
      return;
    }
    // 如果当前步骤索引小于0，则直接返回
    if (this.curIdx < 0) {
      return;
    }

    // 获取当前步骤信息
    let info = this.infos[this.curIdx];

    // 如果当前高度已经达到了要添加的高度，则将当前高度设置为要添加的高度，并停止倾倒动作
    info.height += ANGLE_FACTOR;
    
    // 如果当前高度大于等于要添加的高度，则将当前高度设置为要添加的高度，并停止倾倒动作
    if (info.height >= this.actionHeight) {
      info.height = this.actionHeight;
      this.actionHeight = 0;
      this._action = PourAction.none;
      if (this.onInFInish) {
        this.onInFInish();
        this.onInFInish = null;
      }
    }
    if (this.isFull()) {
      //#region TODO:测试代码 水倒完发事件
      // 派发事件
      // cc.director.emit("custom_event", PourAction.in, this.node.parent);
      //#endregion
    }
    // 更新倾倒角度和高度
    this.updateAngleHeight();
  }
  eventState = false;

  /**
   * 减少水面高度
   * @returns
   */
  public downHeight() {
    // 如果当前步骤索引小于0，则直接返回
    if (this.stopIdx < 0) {
      this._action = PourAction.none;
      return;
    }
    // 获取当前步骤信息
    let info = this.infos[this.curIdx];

    if (!this.isAtBottleTop()) {
      if (info.height < 0.05) {
        // 可能还留了一点点水,要继续倒出去
      } else {
        return;
      }
    }

    this.eventState = true;

    if (this.onOutStart) {
      this.onOutStart();
      this.onOutStart = null;
    }
    // 计算当前倾倒的高度
    info.height -= ANGLE_FACTOR;
    if (this.actionHeight < 0) this.actionHeight = 0;
    // 如果当前高度小于0.01，则将当前高度设置为0，并将当前步骤从数组中移除，并将当前步骤索引减1
    if (info.height <= this.actionHeight) {
      info.height = this.actionHeight;
      if (this.actionHeight <= 0) {
        this.infos.pop();
        this.curIdx--;
        this.stopIdx = -1;
      }
      this.eventState = false;
      if (this.onOutFinish) {
        this.onOutFinish();
        this.onOutFinish = null;
      }
      this._action = PourAction.none;
      this.actionHeight = 0;
    }
    // 更新倾倒角度和高度
    this.updateAngleHeight();
  }

  /**
   *  判断是否满杯
   * @returns 是否满杯
   */
  public isFull() {
    // 如果当前步骤索引小于0，则直接返回
    let cur_height = this.infos.reduce((pre, cur) => {
      return pre + cur.height;
    }, 0);
    return cur_height >= HEIGHT_FACTOR;
  }
  /**
   *  判断是否为空
   * @returns 是否为空
   */
  isEmpty() {
    return this.infos.length == 0;
  }
  /**
   * 获取最上面元素
   * @returns 获取当前水层信息
   */
  getTopInfo() {
    return this.infos[this.curIdx];
  }
  /**
   * 倾斜到哪个角度开始往外边倒水
   */
  public getPourStartAngle() {
    /**
     * 当前水的高度
     */
    let _height = 0;
    for (let i = 0; i <= this.curIdx; i++) {
      // 遍历当前步骤之前的所有步骤
      _height += this.infos[i].height; // 将每个步骤的高度相加
    }
    return this.getCriticalAngleWithHeight(_height); // 返回临界角度
  }
  /**
   * 倾斜到哪个角度开始停止倒水（当前颜色的水倒完了）
   */
  public getPourEndAngle() {
    this.stopIdx = this.curIdx - this.getTopSameColorNum();

    let _height = 0;
    for (let i = 0; i <= this.stopIdx; i++) {
      _height += this.infos[i].height;
    }

    return this.getCriticalAngleWithHeight(_height);
  }
  /**
   *  获取某一高度的水刚好碰到瓶口的临界倾斜角度
   * @param _height  当前水的高度
   * @returns 临界角度 0-90
   */
  private getCriticalAngleWithHeight(_height: number) {
    /**
     * 临界角度
     */
    let ret = 0;
    if (_height == 0) {
      // 如果水的高度为 0，则返回 90 度
      ret = 90;
      return ret;
    }

    if (_height < 0.5) {
      // 如果水的高度小于 0.5，则使用第一种计算方式(假设水的体积小于杯子的一半，因此水会先碰到下瓶底。我们可以使用三角函数计算出水的倾斜角度。)
      //水的体积小于杯子的一半,先碰到下瓶底
      let tanVal = this._ratio / (_height * 2.0);
      ret = Math.atan(tanVal);
    } else {
      // 如果水的高度大于等于 0.5，则使用第二种计算方式(假设水的体积大于等于杯子的一半，因此水会先碰到瓶口。我们可以使用三角函数计算出水的倾斜角度。)
      let tanVal = 2.0 * this._ratio * (1.0 - _height);
      ret = Math.atan(tanVal);
    }
    ret = radian2angle(ret); // 将弧度转换为角度并返回结果
    return ret;
  }
  /**
   * 开始倒水
   * 一直倒水直到不同颜色的水到达瓶口，为当前最大能倾斜的角度
   * @param num 减少的数量
   * @returns 返回值为倾斜角度的绝对值
   */
  public onStartPour(num?: number) {
    this._action = PourAction.out;
    // 一块的高度
    let oneBlockHeight = HEIGHT_FACTOR / SPLIT_COUNT;
    if (num) {
      this.actionHeight = this.infos[this.curIdx].height - num * oneBlockHeight;

    }
    if (this.actionHeight <= 0) {
      this.actionHeight = 0;
    }
    this.stopIdx = this.curIdx - this.getTopSameColorNum();
    if (this.stopIdx < 0) {
      this.stopIdx = 0;
    }
  }

  /**
   * 获取当前水层中最上面与当前颜色相同的水的数量
   * @returns 相同颜色水的数量
   */
  private getTopSameColorNum() {
    /**  相同颜色的数量 */
    let sameColorNum = 0; //
    /** 颜色编号 */
    let colorId = null; // 颜色编号
    for (let i = this.curIdx; i >= 0; i--) {
      // 从当前索引开始向前遍历
      if (colorId == null) {
        // 如果颜色编号为 null，则将其设置为当前颜色编号，并将相同颜色的数量加 1。
        sameColorNum++;
        colorId = this.infos[i].colorId;
      } else if (this.infos[i].colorId == colorId) {
        // 如果当前颜色编号与颜色编号相同，则将相同颜色的数量加 1。
        sameColorNum++;
      } else {
        // 如果当前颜色编号与颜色编号不同，则跳出循环。
        break;
      }
    }
    return sameColorNum; // 返回相同颜色的数量
  }
  /**
   *  判断水是否到达瓶口
   * @returns
   */
  private isAtBottleTop(): boolean {
    let totalHeight = 0; // 总高度
    for (let i = 0; i <= this.curIdx; i++) {
      // 遍历当前步骤之前的所有步骤
      totalHeight += this.infos[i].height; // 将每个步骤的高度相加
    }
    const angle = ((this.tiltAngle % 360) * Math.PI) / 180.0; // 计算倾斜角度
    const tangent = Math.abs(Math.tan(angle)); // 计算正切值
    if (totalHeight < 0.5) {
      // 如果总高度小于 0.5，则使用第一种计算方式
      return tangent > this._ratio / (totalHeight * 2.0); // 判断是否在瓶口
    } else {
      // 如果总高度大于等于 0.5，则使用第二种计算方式
      const remainingHeight = 1.0 - totalHeight; // 计算剩余高度
      return tangent > 2.0 * this._ratio * remainingHeight; // 判断是否在瓶口
    }
  }

  update(dt) {
    if (this._action == PourAction.out) {
      this.downHeight();
    } else if (this._action == PourAction.in) {
      this.upHeight();
    }

    // console.log(this.isFull());
  }

  private onInFInish: Function = null;
  public setPourInCallback(onInFInish: Function) {
    this.onInFInish = onInFInish;
  }

  private onOutStart: Function = null;
  private onOutFinish: Function = null;
  public setPourOutCallback(onOutStart: Function, onOutFinish: Function) {
    this.onOutStart = onOutStart;
    this.onOutFinish = onOutFinish;
  }
}
