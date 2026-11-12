// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Clips } from "./enum/Enums";
import { AudioMgr } from "./manager/AudioMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Gongde extends cc.Component {




    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        // 动画上移动450 透明0
        AudioMgr.ins.playSound(Clips.muyu);

        cc.tween(this.node).set({ y: this.node.y, opacity: 255 }).to(1.5, { y: this.node.y + 650, opacity: 0 }).call(()=>{
            this.animationFinshFn()
        }).start();

    }

    animationFinshFn() {
        // console.log('动画播放完成');
        //

        this.node.destroy()
    }
    onDestroy() {
    }
    // update (dt) {}
}
