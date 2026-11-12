// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../Global";
import { events } from "../enum/Enums";
import { randomNum } from "../utils/Tools";
import CupMgr from "./CupMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RandomCupMgr extends CupMgr {


    /**
     * 初始化关卡配置
     */
    protected initCfg() {
        this.curCfg = [];
        let cfgArr: Array<number> = this.levelCfg.json[Global.challenge_lv - 1]; //每一关的数据，都是数组，每四个数字代表一杯水 
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

}
