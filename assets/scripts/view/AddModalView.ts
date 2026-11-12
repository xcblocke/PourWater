// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { DyPlatform } from "../ad/DyPlatform";
import { Key } from "../enum/Enums";
import EnergyMgr from "../manager/EnergyMgr";
import { load, save } from "../utils/Tools";
import BaseView from "./BaseView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AddModalView extends BaseView {

    @property([cc.SpriteFrame])
    imgs: cc.SpriteFrame[] = [];

    @property(cc.Node)
    addBtn: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        const value = load(Key.SideReward)
        if (value) {
            this.hiddenBtn()
        }
        console.log(DyPlatform.ins.haveSideReward,'DyPlatform.ins.haveSideReward');
        
        this.addBtn.getComponent(cc.Sprite).spriteFrame = DyPlatform.ins.haveSideReward ? this.imgs[1] : this.imgs[0];
    }

    hiddenBtn() {
        this.addBtn.active = false
    }
    rewardClick() {
        if (DyPlatform.ins.haveSideReward) {
            EnergyMgr.ins.changeEnergy(true, 10)
            save(Key.SideReward, 1)
            this.hiddenBtn()
        } else {
            DyPlatform.ins.openToScence()
        }
    }

    // 不要了
    close(): void {
        super.close();
        this.node.destroy();
    }


    start() {

    }

    // update (dt) {}
}
