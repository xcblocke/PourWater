/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-07-25 07:47:37
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-09-07 22:31:13
 * @FilePath: \倒水游戏重构\assets\scripts\utils\Tools.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

/**
 * @description: save data into localstorage
 * @return {*}
 */
export function save(key: string, val: string | number | any) {
  if (typeof val === "number") {
    val = ("" + val) as string;
  }
  cc.sys.localStorage.setItem(key, val || "");
}

/**
 * @description: load localstorage data,
 * @return {*}
 */
export function load(key: string, type: 0 | 1 | 2 = 1) {
  let res: any = cc.sys.localStorage.getItem(key);
  if (res) {
    switch (type) {
      case 0:
        break;
      case 1:
        res = Number(res);
        break;
      case 2:
        res = JSON.parse(res);
        break;
    }
    return res;
  } else {
    return null;
  }
}

// 获取年月日
export function getDate() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  // return { year, month, day };
  return `${year}-${month}-${day}`;
}

interface IScrollParams<T> {
  /** 数据 */
  list: T[];
  /** 间距 */
  spacing: number;
  /** 每排几个 */
  row: number;
  /** 滚动组件 */
  scrollView: cc.ScrollView;
  /** 滚动内容 */
  content: cc.Node;
  /** 每个item的高度 */
  receiveItemHeight: number;
  /** 回调函数 */
  cb: (item: T, index: number,list:T[]) => void;
}
/**
 *  滚动函数
 * @param param0  list:数据 spacing:间距 scrollView:滚动组件 content:滚动内容 receiveItemHeight:每个item的高度 cb:回调函数
 */
export function scrollFunc<T>({
  list,
  spacing,
  row,
  scrollView,
  content,
  receiveItemHeight,
  cb,
}: IScrollParams<T>) {
  content.removeAllChildren();
  let nums = list.length;
  content.height = Math.ceil(nums / row) * (receiveItemHeight + spacing);
  for (let i = 0; i < nums; i++) {
    cb && cb(list[i], i,list);
  }
  //滚动到0位置
  scrollView.scrollToTop(0);
}

/**
 * 指定范围随机数
 * @param minNum  最小值
 * @param maxNum  最大值
 * @returns
 */
export function randomNum(minNum: number, maxNum: number) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + "");
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum + "");
      break;
    default:
      return 0;
      break;
  }
}

export class Tools {
  /* node fade In */
  static fadeIn(node: cc.Node, dura = 0.2) {
    cc.tween(node).set({ scale: 0 }).to(dura, { scale: 1 }).start();
  }
  
}
