//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html
/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-07-25 07:41:19
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-07-25 07:48:04
 * @FilePath: \倒水游戏重构\assets\scripts\manager\EnergyMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../Global";
import { Key, events, ui } from "../enum/Enums";
import { load, save } from "../utils/Tools";
import HomeTopView from "../view/HomeTopView";
import ResMgr from "./ResMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnergyMgr extends cc.Component {
  @property(cc.Label)
  energyLabel: cc.Label = null;
  @property(cc.Label)
  timerLabel: cc.Label = null;
  // LIFE-CYCLE CALLBACKS:

  private _e = 0;
  private _time = 0;

  private _maxLabel = "∞";
  get energyNum() {
    return this._e;
  }
  set energyNum(v) {
    this._e = v;
    this.energyLabel.string = Math.floor(this._e) + "";
    //     if(Global.powerClickCount >= 3) {
    //     this.energyLabel.string = this._maxLabel;
    // }else{
    //     this.energyLabel.string = Math.floor(this._e) + "";
    // }
  }
  // onLoad () {}
  public static ins: EnergyMgr = null;
  /** 流逝时间 */
  private _passTime = 0;

  start() {
    EnergyMgr.ins = this;
    const timeLast = Number(load(Key.LastTime)); // 获取上次记录的时间
    const timeNow = Date.now(); // 获取当前时间
    this.timerLabel.string = "";
    if (timeLast) {
      // 如果上次记录的时间存在
      let energy = Number(load(Key.Energy)); // 获取上次记录的能量值
      if (energy < Global.startEnergy) {
        // 如果能量值小于起始能量值
        this.startTimer(); // 开始计时器
      }
      /* 比较时间 */
      if (timeNow > timeLast) {
        // 如果当前时间大于上次记录的时间
        //#region
        // if (energy < Global.startEnergy) energy = Global.startEnergy
        //#endregion
        //#region
        if (energy < Global.startEnergy) {
          
          // 如果能量值小于起始能量值
          const time = timeNow - timeLast; // 计算时间差
          const t = Math.floor(time / 1000); // 将时间差转换为秒数
          const e = Math.floor(t / Global.recoveryEnergyTime); // 计算恢复的能量值
          this._passTime = t % Global.recoveryEnergyTime + (load(Key.PassTime) || 0); // 记录已经过去的时间
          energy += e; // 增加能量值
          if(this._passTime > Global.recoveryEnergyTime) {
            energy++;
            this._passTime -=Global.recoveryEnergyTime;
          }
          if (energy > Global.startEnergy) {
            // 如果能量值大于起始能量值
            energy = Global.startEnergy; // 将能量值设为起始能量值
          }
        }
        //#endregion

        save(Key.Energy, energy); // 保存能量值
        save(Key.LastTime, timeNow); // 保存当前时间
        // 记录流失时间
        
      }
      this.energyNum = energy; // 设置能量值
    } else {
      // 如果上次记录的时间不存在
      save(Key.LastTime, timeNow); // 保存当前时间
      save(Key.Energy, Global.startEnergy); // 保存起始能量值
      this.energyNum = Global.startEnergy; // 设置能量值为起始能量值
    }
    cc.director.on(events.addPower, this.changeEnergy, this); // 监听增加能量值的事件
  }
  /* 增加或减少能量值 */
  changeEnergy(add = false, power?: number) {
    const timeNow = Date.now(); // 获取当前时间
    save(Key.LastTime, timeNow); // 保存当前时间
    let energy = Number(load(Key.Energy)); // 获取能量值
    if (add) {
      // 如果是增加能量值
      energy += power || Global.addEnergy; // 增加能量值
      const self = this.getComponent(EnergyMgr);
      cc.tween(self)
        .to((power || Global.addEnergy) / 10, { energyNum: energy })
        .start(); // 缓慢增加能量值
      save(Key.Energy, energy); // 保存能量值
      if (energy >= Global.startEnergy) {
        // 如果能量值大于等于起始能量值
        this.timerLabel.string = ""; // 清空计时器
        this.unschedule(this.updateTimer); // 取消计时器
      }
      return true;
    } else {
      // 如果是减少能量值
      const result = energy - Global.levelEnergy; // 计算减少后的能量值
      //   // 无限体力状态则直接进入下一关
      //   if (Global.powerClickCount >= 3) {
      //     // 如果是无限体力状态
      //     return true; // 直接进入下一关
      //   }
      if (result < 0) {
        // 如果能量值不足
        this.showEnergy(); // 显示能量不足的提示
        HomeTopView.ins.showPowerModal()
        return false;
      } else {
        energy -= Global.levelEnergy; // 减少能量值
        save(Key.Energy, energy); // 保存能量值
        this.energyLabel.string = "" + energy; // 更新能量值的显示

        if (energy < Global.startEnergy) {
          // 如果能量值小于起始能量值
          this.startTimer(); // 开始计时器
        }

        return true;
      }
    }
  }
  startTimer() {
    // 开始计时器
    this.timerLabel.string = ""; // 清空计时器

    this.schedule(this.updateTimer, 1); // 每秒钟更新计时器
  }

  updateTimer() {
    // 更新计时器
    let energy = Number(load(Key.Energy)); // 获取能量值

    // if (energy >= Global.startEnergy || Global.powerClickCount >= 3) {
    if (energy >= Global.startEnergy) {
      // 如果能量值大于等于起始能量值或者是无限体力状态
      //   if (Global.powerClickCount >= 3) this.energyLabel.string = this._maxLabel; // 如果是无限体力状态，将能量值显示为最大值
      this.timerLabel.string = ""; // 清空计时器
      this.unschedule(this.updateTimer); // 取消计时器
      return;
    }
    this._time++; // 增加计时器时间

    if (this._time > Global.recoveryEnergyTime) {
      // 如果计时器时间大于恢复能量所需时间
      this._time = 0; // 重置计时器时间
      let energy = Number(load(Key.Energy)); // 获取能量值
      energy++; // 增加能量值
      save(Key.Energy, energy); // 保存能量值

      this.energyLabel.string = "" + energy; // 更新能量值的显示
      if (energy > Global.startEnergy) {
        // 如果能量值大于起始能量值
        this.timerLabel.string = ""; // 清空计时器
        this.unschedule(this.updateTimer); // 取消计时器
      }
      return;
    }
    // {

    let time = Global.recoveryEnergyTime - this._time - this._passTime; // 计算剩余时间
    this._time += this._passTime;
    this._passTime = 0;
    let mins = Math.floor(time / 60); // 计算分钟数

    let sec = time - mins * 60; // 计算秒数

    this.timerLabel.string = mins + ":" + sec; // 更新计时器的显示
    save(Key.PassTime, Global.recoveryEnergyTime - sec); // 保存当前时间

    // }
  }
  async showEnergy() { // 显示能量不足的提示 TODO:
    // director.emit(events.Toast, "鸡蛋不足");
    // await ResMgr.ins.getUI(ui.MoneyView);
}
  // update (dt) {}
}
