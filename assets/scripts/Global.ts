import { Key, SoundStatus, events } from "./enum/Enums";
import { Action, _DrawOneInfo } from "./interfaces/BaseInter";
import { getDate, load, save } from "./utils/Tools";
export const defaultChallengeLv = 200
export class Global {
  static Debug = true;
  /**背景音乐 */
  static bgm = SoundStatus.on;
  /**音效 */
  static sound = SoundStatus.on;
  /** 加载进度 */
  static LoadingRate = 0;

  /** 是否开启分享 */
  static enableShareAd = true;
  /** 开始 */
  static start = false;

  static layer: cc.Node[] = [];
  static challenge_lv = defaultChallengeLv;
  static openChallenge_lv = 30;
  /** 当前关卡 */
  static lv = 1;
  /** 最大关卡 */
  static maxLv = 999;
  /** 最多试管数 */
  static maxTube = 15;
  /** 回退 */
  static action_list: Array<Action> = [];
  /** 任务数量 */
  static task_num = 5;
  static action_step = 5;

  /* 300s recovery 1 egg,which is 5mins */
  static recoveryEnergyTime = 60;
  // static recoveryEnergyTime = 300;
  static addDebris = 10;

  /* start energy, and also for daily energy recovery */
  static startEnergy = 10;

  /* 增加体力的默认值 */
  static addEnergy = 5;
  /**
   * 每关消耗的体力默认值
   */
  static levelEnergy = 1;
  /** 奖励数组 */
  static _receiveList: string[] = []

  static get receiveList(): string[] {
    return Global._receiveList
  }

  static set receiveList(v: string[]) {
    this._receiveList = v;
  }


  static setReceiveList(value: string) {
    Global._receiveList.push(value)
    this.saveReceiveListLocal()
  }
  static saveReceiveListLocal() {
    save(Key.ReceiveList, JSON.stringify(Global._receiveList));
    save(Key.ReceiveListTime, getDate());
  }
  static clearReceiveList() {
    Global._receiveList = []
    this.saveReceiveListLocal()
  }
  static _propsSetting = {
    /** 重置 */
    reset: 1,
    /** 返回 */
    back: 1,
    /** 试管 */
    tube: 1,
    /** 碎片 */
    debris: 1,
    /** 下一关 */
    next: 1,
  };
  /** 人物配置 */
  static _peopleSetting = {
    haveList: ['C01'],
    current: 'C01',
  };
  /** 管配置 */
  static _cupSetting = {
    haveList: ['01'],
    current: '01',
  };
  static _codeList:string[] = []
  
  static get codeList() : string[] {
    return this._codeList
  }
  static setCodeList(value:string){
    this._codeList.push(value)
    save(Key.CodeList, JSON.stringify(this._codeList));
  }
  static set codeList(value) {
    this._codeList = value;
  }
  static get peopleSetting() {
    return this._peopleSetting;
  }
  static set peopleSetting(value) {
    this._peopleSetting = value;
  }
  static setPeopleCurrent(val) {
    Global._peopleSetting.current =
      val == Global._peopleSetting.current ? null : val;
    save(Key.PeopleSetting, JSON.stringify(Global._peopleSetting));
  }
  static setPeopleHaveList(val) {
    if (Global._peopleSetting.haveList.includes(val)) return;
    Global._peopleSetting.haveList.push(val);
    save(Key.PeopleSetting, JSON.stringify(Global._peopleSetting));
  }
  static get cupSetting() {
    return this._cupSetting;
  }
  static set cupSetting(value) {
    this._cupSetting = value;
  }
  static setCupCurrent(val) {
    Global._cupSetting.current = val == Global._cupSetting.current ? null : val;
    save(Key.CupSetting, JSON.stringify(Global._cupSetting));
  }
  static setCupHavaList(val) {
    if (Global._cupSetting.haveList.includes(val)) return;
    Global._cupSetting.haveList.push(val);
    save(Key.CupSetting, JSON.stringify(Global._cupSetting));
  }
  /** 已签到的数组 */
  static _signArr: string[] = [];
  static get signArr() {
    if (Global._signArr.length === 0) {
      Global._signArr = load(Key.SignArr, 2) || [];
    }
    return Global._signArr;
  }
  static set signArr(arr: string[]) {
    Global._signArr = arr;
    save(Key.SignArr, JSON.stringify(arr));
  }

  /** 添加到已签到的数组 */
  static addSignArr(id: string) {
    save(Key.Today, getDate());
    let arr = this._signArr;
    arr.push(id);
    this.signArr = arr.slice()
  }
  /** 清空已签到的数组 */
  static clearSignArr() {
    this.signArr = [];
  }

  /**
   * 添加道具
   * @param key 道具key
   * @param value  道具数量
   */
  static addPropsSetting(key: _DrawOneInfo["key"], value: number) {
    this._propsSetting[key] += +value;
    save(Key.PropsSetting, JSON.stringify(this._propsSetting));
  }
  /**
   *  获取道具
   * @param key 道具key
   * @returns
   */
  static getPropsSetting(key: _DrawOneInfo["key"]) {
    return +this._propsSetting[key];
  }
  // static reducePropsSetting(key: propKey, value: number) {
  //   this._propsSetting[key] -= value;
  //   save(Key.PropsSetting, this._propsSetting);
  // }
  /**
   * 添加关卡
   */
  static addLv() {
    if (this.lv < this.maxLv) {
      this.lv++;
    }
    save(Key.Lv, this.lv);
  }
  /**
   * 减少关卡
   */
  static subLv() {
    if (this.lv > 1) {
      this.lv--;
    }
    save(Key.Lv, this.lv);
  }
  /**
   * 设置指定关卡
   * @param lv 关卡
   */
  static setLv(lv: number) {
    if (lv > 0 && lv <= this.maxLv) {
      this.lv = lv;
    }
    save(Key.Lv, this.lv);
  }

  /* used for game pause */
  static Pause(isPause = true) {
    cc.director.emit(events.Pause, isPause);
    Global.start = !isPause;
  }
}
//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999