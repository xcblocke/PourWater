/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-07-03 18:15:48
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-09-07 21:51:04
 * @FilePath: \倒水游戏重构\assets\scripts\interfaces\BaseInter.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PropType, TagStatus } from "../enum/Enums";
import Cup from "../game/Cup";

/**一杯水，分成四组四个颜色，0表示没有水 */
export interface _CupInfo {
  colorIds: Array<number>; //长度为4
}
//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
/**
 *
 */
export interface SpacesArr {
  [index: number]: Array<number>;
}

// 记录选中的杯子
export interface _SelectCupInfo {
  oneSecectCup: Cup;
  twoSecectCup: Cup;
}
//
export interface _CupTopInfo {
  /** 返回空位数量 */
  emptyNum: number; //
  /** 返回杯顶颜色ID */
  topColorId: number; //
  /** 返回杯顶颜色数量 */
  topColorNum: number; //
  /** 返回杯顶颜色的十六进制表示，如果颜色ID无效，则返回默认颜色 */
  colorHex: string; //
}

/**
 * 杯子管理器接口
 */
export interface CupManager {
  /** 目标点 */
  dstPt: cc.Vec2;
  /** 目标全局位置 */
  dstGlobal: cc.Vec2;
  /** 视图大小 */
  viewSize: cc.Size;
  /** 是否在右侧 */
  isRight: boolean;
}

/**
 * Action接口，表示一个动作
 */
export interface Action {
  /** 动作的起始位置 */
  from: number;
  /** 动作的结束位置 */
  to: number;
  /** 动作的数量 */
  num: number;
  /** 动作的颜色ID */
  colorId: number;
}

/**
 * 称号接口
 */
export interface ITitle {
  title: string;
  lv: number;
  desc?: string;
  children?: ITitle[];
}

/** 抽奖 */
export interface _DrawOneInfo {
  /** id */
  id: number;
  /** 标签 */
  label: "重置" | "后退" | "试管" | "碎片" | "体力";
  /** key */
  key: "reset" | "back" | "tube" | "debris" | "power" | "next";
  /** 数量 */
  num: number;
}
export enum SignInType {
  // NOT_IN_LIST = '0',
  DAY1 = "1",
  DAY2 = "2",
  DAY3 = "3",
  DAY4 = "4",
  DAY5 = "5",
  DAY6 = "6",
  DAY7 = "7",
  FULL_WEEK = "8",
}
export interface signInInfo extends _DrawOneInfo {
  access: AccessType;
  type: SignInType;
  /** 是否已签到 */
  isSign?: boolean;
}
/** 获取方式 */
export enum AccessType {
  /** 分享 */
  Share = "0",
  /** 视频 */
  Video = "1",
  /** 碎片 */
  Fragment = "2",
  None = "3",
}
export interface TaskOneInfo {
  /** 任务id */
  id: number;
  /** 任务名称 */
  name: string;
  /** 获取方式 */
  access: AccessType;
  /** 任务奖励 */
  num: number;
  /** 任务类型 */
  type: PropType;
  /** 任务完成状态 */
  status?: boolean;
}

export enum ConditionType {
  /** 无 */
  None = "0",
  /** 碎片 */
  Fragment = "1",
  /** 等级 */
  Level = "2",
}

/** 商品 */
export interface ShopOneInfo {
  /** 商品id */
  id: number;
  /** 商品名称 */
  name: string;
  /** 商品价格 */
  price: number;
  /** 获取方式 */
  access: AccessType;
  /** 条件要求（ask） */
  ask?: string;
  /** 解锁条件（condition） */
  condition: ConditionType;
  /** 商品描述 */
  describe: string;
  /** 标签 */
  tag: TagStatus;
  /** 未解锁描述 */
  lockText: string;
}
