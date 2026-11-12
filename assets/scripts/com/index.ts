/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-07-09 09:12:50
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-10-21 20:27:40
 * @FilePath: \倒水游戏重构\assets\scripts\com\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { PropType } from "../enum/Enums";
import { ITitle } from "../interfaces/BaseInter";

/**
 * 根据高度获取临界角度
 * @param radian 弧度
 * @returns 角度
 */
export function radian2angle(radian: number) {
  return (radian / Math.PI) * 180;
}
/**
 * 旋转点
 * @param pt 要旋转的点
 * @param angle 旋转角度
 * @returns 旋转后的点
 */
export function rotatePt(pt: cc.Vec2, angle: number) {
  // 将角度转换为弧度
  let radian = angle2radian(angle);

  // 计算旋转后的点的坐标
  let ret = cc.v2();
  ret.x = pt.x * Math.cos(radian) - pt.y * Math.sin(radian);
  ret.y = pt.x * Math.sin(radian) + pt.y * Math.cos(radian);

  return ret;
}

/**
 * 将角度转换为弧度
 * @param angle 角度
 * @returns 弧度
 */
function angle2radian(angle: number) {
  // 将角度限制在 -360 到 360 之间
  while (angle > 360) {
    angle -= 360;
  }
  while (angle < -360) {
    angle += 360;
  }

  // 将角度转换为弧度并返回
  return ((angle % 360) * Math.PI) / 180.0;
}
/**
 * 防抖函数
 * @param fn  要执行的函数
 * @param delay 延迟时间
 * @returns  防抖函数
 */
export function debounce(fn: Function, delay: number) {
  let timer: any = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(fn, delay);
  };
}

/**
 * 随机数
 * @param min 最小
 * @param max 最大
 * @returns 随机
 */
export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
// 根据道具类型枚举获取道具名称
export const getPropNameByType = (type: PropType, isChinese?: boolean) => {
  let name = "";
  switch (type) {
    case PropType.back:
      if (isChinese) {
        name = "后退";
      } else {
        name = "back";
      }
      break;
    case PropType.reset:
      if (isChinese) {
        name = "重置";
      } else {
        name = "reset";
      }
      break;
    case PropType.tube:
      if (isChinese) {
        name = "试管";
      } else {
        name = "tube";
      }
      break;
    case PropType.debris:
      if (isChinese) {
        name = "碎片";
      } else {
        name = "debris";
      }
      break;
    case PropType.power:
      if (isChinese) {
        name = "体力";
      } else {
        name = "power";
      }
      break;
    default:
      break;
  }
  return name;
};

export class Title {
  /**
   * 获取当前等级的称号
   * @param lv 当前等级
   * @param titleArr 称号数组
   */
  static getTitle(lv: number, titleArr: ITitle[]): string {
    let title = "";
    for (let i = 0; i < titleArr.length; i++) {
      const element = titleArr[i];
      const next = titleArr[i + 1];
      if (lv < element.lv) {
        title = element.title;
        if (element.children) {
          title = this.getChildTitle(lv, element.children);
        }
        break;
      } else if (next && element.lv >= lv) {
        title = next.children?.[0].title || "";
      } else {
        title = titleArr[titleArr.length - 1].children?.[0].title || "";
      }
    }
    if (lv >= titleArr[titleArr.length - 1].lv) {
      title =
        titleArr[titleArr.length - 1].children?.[
          titleArr[titleArr.length - 1].children.length - 1
        ].title || "";
    }
    return title;
  }
  /**
   *  获取下一等级的称号
   * @param lv  当前等级
   * @param children  称号数组
   * @returns  称号
   */
  private static getChildTitle(lv: number, children: ITitle[]): string {
    let title = "";
    let nextTitle = "";
    let nextLv = 0;
    for (let j = 0; j < children.length; j++) {
      const child = children[j];
      const child_next = children[j + 1];
      if (lv < child.lv) {
        title = child.title;
        nextLv = child.lv;
        if (child_next) {
          nextTitle = child_next.title;
        }
        break;
      } else {
        title = children[children.length - 1].title;
      }
    }
    return title || nextTitle || "";
  }
  /**
   *  获取当前等级的称号描述
   * @param lv  当前等级
   * @param titleArr 称号数组
   * @returns  称号描述
   */
  static getDesc(lv: number, titleArr: ITitle[]): string {
    let desc = "";
    for (let i = 0; i < titleArr.length; i++) {
      const element = titleArr[i];
      if (lv < element.lv && element.children) {
        desc = element.desc;
        break;
      }
    }
    if (lv >= titleArr[titleArr.length - 1].lv) {
      desc = titleArr[titleArr.length - 1].desc;
    }
    return desc;
  }

  /**
   *  获取下一等级的称号描述
   * @param lv  当前等级
   * @param titleArr  称号数组
   * @returns  称号描述
   */
  static getNextLvDesc(lv: number, titleArr: ITitle[]): string {
    let nextLvDesc = "";
    for (let i = 0; i < titleArr.length; i++) {
      const element = titleArr[i];
      const next = titleArr[i + 1];
      const { nextLv, nextTitle } = this.getNextLvAndTitleByChild(
        lv,
        element.children
      );
      if (lv < element.lv) {
        if (element.lv >= lv) {
          const remainingLv = (nextLv || element.lv) - lv;
          const remainingTitle = nextTitle || next.children?.[0].title || "";
          nextLvDesc = `<b><outline color=#000000 width=4><color=#ffffff>再过<color=#FA5A00>${remainingLv}</color>关，可晋升为<color=#FA5A00>${remainingTitle}</color></color></outline></b>`;
        }
        break;
      } else {
        nextLvDesc = ""; //TODO:已经是最高级别
      }
    }
    return nextLvDesc;
  }
  /**
   *   获取下一等级的称号和等级
   * @param lv 当前等级
   * @param children 称号数组
   * @returns 称号和等级
   */
  private static getNextLvAndTitleByChild(lv: number, children: ITitle[]) {
    let nextLv = 0;
    let nextTitle = "";
    for (let j = 0; j < children.length; j++) {
      const child = children[j];
      const child_next = children[j + 1];
      if (lv < child.lv) {
        nextLv = child.lv;
        if (child_next) {
          nextTitle = child_next.title;
        }
        break;
      }
      // else {
      //   nextLv = children[children.length - 1].lv;
      // }
    }
    return { nextLv, nextTitle };
  }
}
