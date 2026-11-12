// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global, defaultChallengeLv } from "../Global";
import { Clips, events, ui } from "../enum/Enums";
import { AudioMgr } from "../manager/AudioMgr";
import ResMgr from "../manager/ResMgr";
import ChallengeCancelView from "./ChallengeCancelView";
import ChallengeVictoryModalView from "./ChallengeVictoryModalView";
import GameView from "./GameView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RandomColorGameView extends GameView {
    @property(dragonBones.ArmatureDisplay)
    armatureDisplay: dragonBones.ArmatureDisplay = null

    @property(cc.Node)
    splash: cc.Node = null
    setLvLabel(_lv: number) {
        // level为白色加粗 Global.lv为黄色
        this.lvLabel.string = `<b><color=#000000>level  </c><color=#FA5A00>${Global.challenge_lv - defaultChallengeLv + 1}</c></b>`;
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
    }
    async GameResult() {
        Global.challenge_lv++
        AudioMgr.ins.playSound(Clips.Show_Victory);
        this.init();
        const view = await ResMgr.ins.getUI(ui.ChallengeVictoryModalView);
        // cc.instantiate(view)
        cc.find("Canvas").addChild(view);
        view.getComponent(ChallengeVictoryModalView);

        cc.director.emit(events.Next);
    }
    async goBack() {
        const view = await ResMgr.ins.getUI(ui.ChallengeCancelView);
        // cc.instantiate(view)
        cc.find("Canvas").addChild(view);
        view.getComponent(ChallengeCancelView).toHomeFn = () => {
            cc.director.loadScene("main");
        }
    }
    onLoad(): void {
        //this.init(); FADE_OUT_COMPLETE
        this.armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this.finshFn.bind(this));
    }
    finshFn() {
        // 动画播放完毕
        console.log("Animation completed");
        this.splash.active = false
    }
    // update (dt) {}
}
