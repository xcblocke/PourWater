// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 https://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 https://web3incubators.com/kefu.html
import { events } from "../enum/Enums";
import BaseView from "./BaseView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChallengeCancelView extends BaseView {



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    public toHomeFn: Function
    goHome() {
        this.close();
        if (this.toHomeFn) {
            this.toHomeFn()
        }
    }
    close(): void {
        super.close();
        this.node.destroy();
    }
    // update (dt) {}
}
