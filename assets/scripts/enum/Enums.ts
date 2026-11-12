/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-06-19 21:23:14
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-10-21 20:21:54
 * @FilePath: \倒水游戏重构\assets\scripts\enum\Enums.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
import { ITitle } from "../interfaces/BaseInter";

const { ccclass, property } = cc._decorator;
@ccclass("adConfig")
/** 广告配置 */
export class adConfig {
  @property()
  platform = "platform";
  @property({ type: cc.Integer })
  id = 0;
  @property({ type: cc.String })
  bannerId: string[] = [];
  @property({ type: cc.String })
  intersitialId: string[] = [];
  @property({ type: cc.String })
  videoId: string[] = [];
  @property({ type: cc.String })
  customId: string[] = [];
}
/**
 * 分享内容
 */
@ccclass("shareContent")
export class shareContent {
  @property()
  shareId: string = "";
  @property()
  shareLink: string = "";
  @property()
  shareText: string = "分享标题";
}
/**
 * 视频分享内容
 */
@ccclass("shareVideoContent")
export class shareVideoContent {
  @property()
  shareId: string = "";
  @property()
  title: string = "分享标题";
  @property()
  desc: string = "";
  @property({ type: cc.String })
  videoTopics: string[] = []
}
/**
 * 分享配置
 */
@ccclass("shareConfig")
export class shareConfig {
  @property()
  platform = "platform";
  @property({ type: shareContent })
  sharePics: shareContent[] = [];
}
/**
 * 视频分享配置
 */
@ccclass("shareVideoConfig")
export class shareVideoConfig {
  @property()
  platform = "platform";
  @property({ type: shareVideoContent })
  sharePics: shareVideoContent[] = [];
}
/** 水的基本信息  */
export interface WaterInfo {
  colorId: number;
  color: cc.Color; //颜色
  height: number; //默认情况下，占杯子的高度
}
/** 最大数组长度 */
export const MAX_ARR_LEN = 6;
/**
 * 基本数据
 */
export enum BASIC_DATA {
  /** 颜色分量 */
  color_alpha = 1.0,
  /** 颜色范围 */
  color_range = 255,
  /** 字节 */
  BYTE = 4,
  /** 第二个分量 */
  color_alpha2 = 1,
  /** 第三个分量 */
  color_alpha3 = 2,
  /** 第四个分量 */
  color_alpha4 = 3,
}
/** 倒水状态 */
export enum PourAction {
  none,
  /**往里加水 */
  in,
  /**向外倒水 */
  out,
}
/**高度乘数因子，满杯水只显示80% */
export const HEIGHT_FACTOR = 0.8;
/** 水流动画因数  加减水的速度*/
export const ANGLE_FACTOR = 0.01;
/** 颜色块总个数 */
export const SPLIT_COUNT = 4;
/**
 * 水的颜色
 */
export const WaterColors = [
  "#155DEF",
  "#F2C90F",
  "#BD2656",
  "#F0791F",
  "#454574",
  "#FE2D26",
  "#BCA6E3",
  "#E4584F",
  "#00B38A",
  "#DD2E44",
  "#E5C69A",
  "#65DC8E",
  "#B068F0",
  "#F010BF",
  "#538849",
];

/**
 * 默认颜色
 */
export const defaultColor = "#538849";

/**
 * 动画时间相关参数
 */
export enum AnimationTime {
  /** 倾倒持续时间 */
  pourTime = 0.2,
  /** 移动持续时间 */
  moveTime = 0.1,
}
/**
 * 试管选中状态移动高度
 */
export const TUBE_SELECTED_MOVE_HEIGHT = 100;

/**
 * 默认线宽
 */
export const dft_lingWidth = 6; // 默认线宽
/**
 * 表示不同空间等级的数组。
 * 数组的每个元素都是一个数组，包含了该空间等级的所有信息。
 * 数组的第一个元素表示空间等级的大小，单位为像素。
 * 数组的第二个元素表示空间等级的缩放比例。
 * 数组的第三个元素（可选）表示空间等级的最小宽度，单位为像素。
 */
export const spacesArr = {
  [1]: [40, 1], // 空间等级 1，间距大小为 40，缩放比例为 1
  [2]: [80, 1], // 空间等级 2，间距大小为 80，缩放比例为 1
  [3]: [50, 1], // 空间等级 3，间距大小为 50，缩放比例为 1
  [4]: [40, 0.9], // 空间等级 4，间距大小为 40，缩放比例为 0.9
  [5]: [30, 0.85], // 空间等级 5，间距大小为 30，缩放比例为 0.8
  [6]: [30, 0.85], // 空间等级 6，间距大小为 30，缩放比例为 0.65
  [7]: [20, 0.7, 60], // 空间等级 7，间距大小为 20，缩放比例为 0.6，最小宽度为 60
  [8]: [10, 0.7, 80], // 空间等级 8，间距大小为 10，缩放比例为 0.55，最小宽度为 80
};
/**
 * 道具类型枚举
 */
export enum PropType {
  /** 重置 */
  reset,
  /** 后退 */
  back,
  /** 加管 */
  tube,
  /** 碎片 */
  debris,
  /** 体力 */
  power,
}

/**
 * 音效相关状态
 */
export enum SoundStatus {
  /** 音效开启 */
  on = 1,
  /** 音效关闭 */
  off = -1,
}
/**
 * 音效类型
 */
export const Clips = {
  Button_Click: "Button_Click",
  challenge: "challenge",
  ContainerFinish: "ContainerFinish",
  draw: "draw",
  firework_1: "firework_1",
  modal: "modal",
  pourWater: "pourWater",
  // rank_lisk: "rank_lisk",
  Show_Victory: "Show_Victory",
  reward: "reward",
  music: "music",
  muyu: "muyu",
};
/**
 * 音效类型
 */
export type AssetType = {
  type: typeof cc.Asset;
  path: string;
};
/**
 * assettypes and paths
 */
export const Assets = {
  BrickPrefab: { type: cc.Prefab, path: "Preload/Prefabs/Brick" } as AssetType,
  UiPrefab: { type: cc.Prefab, path: "Preload/Prefabs/UI/" } as AssetType,
  NewYear: { type: cc.Prefab, path: "Preload/Prefabs/NewYear/" } as AssetType,
  PropPrefab: { type: cc.Prefab, path: "Preload/Prefabs/Prop/" } as AssetType,
  Json: { type: cc.JsonAsset, path: "Preload/Jsons/" } as AssetType,
  Spin: { type: cc.Asset, path: "Preload/Spin/" } as AssetType,
  Sound: { type: cc.AudioClip, path: "Preload/Clips/" } as AssetType,
  Frame: { type: cc.SpriteFrame, path: "Preload/UI/" } as AssetType,
  Material: { type: cc.Material, path: "Preload/Effect/" } as AssetType,
};

/** 事件 */
export const Key = {
  PropsSetting: "propsSetting",
  /** 体力 */
  Energy: "Energy",
  /** 上次时间 */
  LastTime: "LastTime",
  /** 流失时间 */
  PassTime: "PassTime",
  Lv: "Lv",
  SignArr: "SignArr",
  Today: "Today",
  PeopleSetting: "peopleSetting",
  CupSetting: "cupSetting",
  ReceiveList: 'ReceiveList',
  ReceiveListTime: 'ReceiveListTime',
  SideReward: 'SideReward',
  CodeList:'CodeList'
};

export const events = {
  Challenge: "challenge",
  gameStart: "gameStart",
  Toast: "toast",
  closeGame: "closeGame",
  addPower: "addPower",
  changeSound: "changeSound",
  taskFinish: "taskFinish",
  /** 重置 */
  Reset: "Reset",
  /** 后退 */
  Back: "Back",
  /** 加管 */
  AddTube: "AddTube",
  /** 下一关 */
  Next: "Next",
  /** 时间停止 */
  TimeStop: "TimeStop",
  /** 随机 */
  Random: "Random",
  /** 视频分享 */
  GoFire: "GoFire",
  /** 一关结束 */
  LevelFinish: "LevelFinish",

  Do_pour: "Do_pour",
  /** 暂停 */
  Pause: "Pause",
  OpenPowerModal: "OpenPowerModal",
  ExcuteGuideTask: 'ExcuteGuideTask',
  ReceiveClose: 'ReceiveClose'
};

/* for ui prefabs config */
export const ui = {
  /* 
  name 属性表示该视图的名称，layer 属性表示该视图所在的层级，clear 属性表示是否在显示该视图之前清除其他视图。
  */
  HomeTopView: { name: "HomeTopView", layer: 0, clear: false },
  HomeView: { name: "HomeView", layer: 0, clear: false },
  // EditorView: { name: 'EditorView', layer: 0, clear: true },
  // BuildView: { name: 'BuildView', layer: 0, clear: true },
  GameView: { name: "GameView", layer: 3, clear: false },
  RandomColorGameView: { name: "RandomColorGameView", layer: 3, clear: false },
  // BuildCardView: { name: 'BuildCardView', layer: 1, clear: false },
  // TopView: { name: 'TopView', layer: 4, clear: false },
  ResultView: { name: "VictoryModalView", layer: 3, clear: false },
  ChallengeVictoryModalView: { name: "ChallengeVictoryModalView", layer: 3, clear: false },
  DrawView: { name: "DrawView", layer: 3, clear: false },
  SignModalView: { name: "SignModalView", layer: 3, clear: false },
  ShopView: { name: "ShopModalView", layer: 3, clear: false },
  PeopleModalView: { name: "PeopleModalView", layer: 3, clear: false },
  ReceiveModalView: { name: "ReceiveModalView", layer: 3, clear: false },
  PropsModalView: { name: "PropsModalView", layer: 3, clear: false },
  DrawPropsModalView: { name: "DrawPropsModalView", layer: 3, clear: false },
  PhysicalModalView: { name: "PhysicalModalView", layer: 3, clear: false },
  AddModalView: { name: "AddModalView", layer: 3, clear: false },
  ChallengeCancelView: { name: "ChallengeCancelView", layer: 3, clear: false },
  PropRoleOrCupModalView: {
    name: "PropRoleOrCupModalView",
    layer: 3,
    clear: false,
  },
  // HomeView: { name: 'HomeView', layer: 0, clear: false },
  // TouchView: { name: 'TouchView', layer: 5, clear: false },
  // StoreView: { name: 'StoreView', layer: 4, clear: false },
  // MoneyView: { name: 'MoneyView', layer: 5, clear: false },
  // CustomView: { name: 'CustomView', layer: 5, clear: true },
  // AdView: { name: 'AdView', layer: 5, clear: false },
  ToastView: { name: 'ToastView', layer: 6, clear: false },
  GongdeView: { name: 'GongdeView', layer: 6, clear: false },


  DragonGetModal: { name: 'DragonGetModal', layer: 6, clear: false },
  DragonAVModal: { name: 'DragonAVModal', layer: 6, clear: false },
  RedemptionCodeModalView: { name: "RedemptionCodeModalView", layer: 6, clear: false },
  RedemptionCodeInputView: { name: "RedemptionCodeInputView", layer: 6, clear: false },
};
export const prop = {
  reset: { name: "reset", layer: 3, clear: false },
  back: { name: "back", layer: 3, clear: false },
  tube: { name: "tube", layer: 3, clear: false },
  debris: { name: "debris", layer: 3, clear: false },
  power: { name: "power", layer: 3, clear: false },
};
/**
 * 称号
 */
export const titleArr: ITitle[] = [
  {
    title: "笨头笨脑",
    lv: 8,
    desc: "",
    children: [
      {
        title: "笨头笨脑1星",
        lv: 3,
      },
      {
        title: "笨头笨脑2星",
        lv: 5,
      },
      {
        title: "笨头笨脑3星",
        lv: 8,
      },
    ],
  },
  {
    title: "马马虎虎",
    lv: 24,
    desc: "",
    children: [
      {
        title: "马马虎虎1星",
        lv: 10,
      },
      {
        title: "马马虎虎2星",
        lv: 13,
      },
      {
        title: "马马虎虎3星",
        lv: 18,
      },
      {
        title: "马马虎虎4星",
        lv: 24,
      },
    ],
  },
  {
    title: "平凡无奇",
    lv: 50,
    desc: "",
    children: [
      {
        title: "平凡无奇1星",
        lv: 30,
      },
      {
        title: "平凡无奇2星",
        lv: 34,
      },
      {
        title: "平凡无奇3星",
        lv: 39,
      },
      {
        title: "平凡无奇4星",
        lv: 50,
      },
    ],
  },
  {
    title: "聪明出众",
    lv: 86,
    desc: "",
    children: [
      {
        title: "聪明出众1星",
        lv: 60,
      },
      {
        title: "聪明出众2星",
        lv: 65,
      },
      {
        title: "聪明出众3星",
        lv: 73,
      },
      {
        title: "聪明出众4星",
        lv: 86,
      },
    ],
  },
  {
    title: "足智多谋",
    lv: 150,
    desc: "",
    children: [
      {
        title: "足智多谋1星",
        lv: 100,
      },
      {
        title: "足智多谋2星",
        lv: 108,
      },
      {
        title: "足智多谋3星",
        lv: 120,
      },
      {
        title: "足智多谋4星",
        lv: 150,
      },
    ],
  },
  {
    title: "聪明绝顶",
    lv: 215,
    desc: "",
    children: [
      {
        title: "聪明绝顶1星",
        lv: 150,
      },
      {
        title: "聪明绝顶2星",
        lv: 170,
      },
      {
        title: "聪明绝顶3星",
        lv: 185,
      },
      {
        title: "聪明绝顶4星",
        lv: 215,
      },
    ],
  },
  {
    title: "神机妙算",
    lv: 310,
    desc: "",
    children: [
      {
        title: "神机妙算1星",
        lv: 250,
      },
      {
        title: "神机妙算2星",
        lv: 260,
      },
      {
        title: "神机妙算3星",
        lv: 280,
      },
      {
        title: "神机妙算4星",
        lv: 310,
      },
    ],
  },
  {
    title: "智慧无边",
    lv: 410,
    desc: "",
    children: [
      {
        title: "智慧无边1星",
        lv: 330,
      },
      {
        title: "智慧无边2星",
        lv: 350,
      },
      {
        title: "智慧无边3星",
        lv: 380,
      },
      {
        title: "智慧无边4星",
        lv: 410,
      },
    ],
  },
];
/**
 * 人物状态枚举
 */
export enum RoleStatus {
  /** 未解锁 */
  locked,
  /** 已解锁 */
  unlocked,
  /** 选中 */
  selected,
}
/**
 * 标签状态枚举
 */
export enum TagStatus {
  /** 法 */
  law,
  /** 神 */
  god,
}
