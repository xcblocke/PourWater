// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global, defaultChallengeLv } from "../Global";
import { events, ui } from "../enum/Enums";
import EnergyMgr from "../manager/EnergyMgr";
import ResMgr from "../manager/ResMgr";
import { randomNum } from "../utils/Tools";
import BaseView from "./BaseView";
import ChallengeCancelView from "./ChallengeCancelView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChallengeVictoryModalView extends BaseView {

    @property([cc.SpriteFrame])
    titleArr: cc.SpriteFrame[] = [];

    @property(cc.RichText)
    lvDesc: cc.RichText = null;

    @property(cc.Sprite)
    titleSprite: cc.Sprite = null;
    @property(cc.Node)
    goFireBtn: cc.Node = null;
    
    onLoad() {
        if (!window["tt"]) this.goFireBtn.active = false
        this.init();
    }

    start() {

    }
    loadLevel() {
        super.close();
        const energy = EnergyMgr.ins.changeEnergy(false);

        if (!energy) {
            cc.director.emit(events.Toast, `体力不足`)
            // cc.director.emit(events.OpenPowerModal)
            return
        }
        this.node.destroy();
        cc.director.emit(events.Next);
    }
    async returnHome() {
        const view = await ResMgr.ins.getUI(ui.ChallengeCancelView);
        // cc.instantiate(view)
        cc.find("Canvas").addChild(view);
        view.getComponent(ChallengeCancelView).toHomeFn = () => {
            cc.director.loadScene("main");
        }
    }
    setTitleSprite() {
        const num = randomNum(0, this.titleArr.length - 1)
        this.titleSprite.spriteFrame = this.titleArr[num];
    }
    init() {
        this.getLevelTitle(Global.challenge_lv - defaultChallengeLv);
        this.setTitleSprite();
    }
    getLevelTitle(lv?: number) {
        this.lvDesc.string = `<color=#ffffff>挑战关卡：第<color=#FD6F31>${lv}</color>关</color>`
    }
    shareFn() {
        super.share(() => {
            // TODO:分享
            console.log("分享");
        });
    }
    videoPath!: string
    getVideoSharePath(videoPath) {
        this.videoPath = videoPath
    }
    onEnable() {
        cc.director.on(events.closeGame, this.getVideoSharePath, this);
    }
    onDisable() {
        cc.director.off(events.closeGame, this.getVideoSharePath, this);
    }
    goFire() {
        super.shareVideo(this.videoPath)
    }
    // update (dt) {}
}
