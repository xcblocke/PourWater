// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../Global";
import { Clips, events, ui } from "../enum/Enums";
import { AudioMgr } from "../manager/AudioMgr";
import ResMgr from "../manager/ResMgr";
import BaseView from "../view/BaseView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DragonAVModal extends BaseView {



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }
    getReward() {
        super.showVideo(() => {
            Global.setPeopleHaveList('C10')
            const { current, haveList } = Global.peopleSetting;
            const haveState = haveList.includes('C10');
            if (!haveState || current === 'C10') return;
            Global.setPeopleCurrent('C10');
            cc.director.emit(events.closeGame);
            AudioMgr.ins.playSound(Clips.modal, 0.5);

            this.openDragonAniModal()
            this.close()
        })
    }
    async openDragonAniModal() {
        let dragonGetModal = await ResMgr.ins.getUI(ui.DragonGetModal);
        dragonGetModal.parent = cc.find('Canvas')
    }
    
    close() {
        this.node.destroy()
    }

    // update (dt) {}
}
