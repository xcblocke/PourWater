// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global, defaultChallengeLv } from "../Global";
import { events } from "../enum/Enums";
import Cup from "./Cup";

const { ccclass, property } = cc._decorator;

interface _TColorInfo {
    colors: string[];
    default_color: string;
}
const color_list: _TColorInfo[] = [
    {
        colors: ["#FF7B31", "#FFBA09", "#F7C850", "#FFAE4F", "#E8770F", "#DA6F33", "#F3B865", "#F3A165", "#C95141", "#E38F74", "#99221A", "#F29F3E", "#F88848", "#BE5A12", "#FFB198",],
        default_color: '#FFB198'
    },
    {
        colors: ["#DD8C71", "#E9BE85", "#E7CA95", "#E6B58C", "#CA8565", "#BE7C65", "#E0BC95", "#DBA98C", "#AC635C", "#CB988B", "#803B39", "#D9A77E", "#DA957A", "#A46750", "#E8B9AC",],
        default_color: '#E8B9AC'
    },
]

function getNumToColorConfig(startNum: number, configArrLen: number, spaceNum: number) {
    let current = 0,lastLv
    function getNum(num: number) {
        if (num == lastLv) {
            return current;
        }
        lastLv = num
        if (num % spaceNum == 0) {
            current++;
        }
        if ((num % (spaceNum * configArrLen)) === 0 || num == startNum) {
            current = 0;
        }
        return current;
    }
    return getNum;
}
let getNum = null
@ccclass
export default class RandowColorCup extends Cup {


    @property(cc.Integer)
    randomSpace: number = 10
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (!getNum) getNum = getNumToColorConfig(defaultChallengeLv, color_list.length, this.randomSpace)
        console.log(getNum(Global.challenge_lv),Global.challenge_lv);
        const {
            colors,
            default_color
        } = color_list[getNum(Global.challenge_lv)]
        this.setWaterColor(colors, default_color)
    }


    // update (dt) {}
}
