// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../Global";
import { events, ui } from "../enum/Enums";
import { _DrawOneInfo } from "../interfaces/BaseInter";
import EnergyMgr from "../manager/EnergyMgr";
import ResMgr from "../manager/ResMgr";
import BaseView from "./BaseView";
import RedemptionCodeModalView from "./RedemptionCodeModalView";

const { ccclass, property } = cc._decorator;

interface IRendemPtionCode {
    code: string;
    list: _DrawOneInfo[]
}
@ccclass
export default class RedemptionCodeInputView extends BaseView {

    @property(cc.EditBox)
    editBox: cc.EditBox = null


    // LIFE-CYCLE CALLBACKS:
    codeList: IRendemPtionCode[]
    onLoad() {
        let { json }: { json: IRendemPtionCode[] } = ResMgr.ins.getJson("redemptionCode");
        this.codeList = json
    }

    start() {

    }
    close() {
        super.close();
        this.node.destroy();
    }
    codeString: string = ''
    inputChange(e) {
        this.editBox.string = this.codeString = (e.string ?? e).replace(/[^a-zA-Z0-9]/g, '') 
    }

    async redemptionCodeChange(e) {
        const one = this.codeList.find(item => item.code === this.codeString)

        if (!one) {
            cc.director.emit(events.Toast, "兑换码不正确，请重新输入");
        } else {
            if (Global.codeList.includes(this.codeString)) {
                cc.director.emit(events.Toast, "兑换码已被领取");
                return
            }
            Global.setCodeList(this.codeString)
            let propsView = await ResMgr.ins.getUI(ui.RedemptionCodeModalView);
            let propModalView = propsView.getComponent(RedemptionCodeModalView);

            propModalView.renderProps(one.list);
            propsView.parent = cc.find('Canvas')
            for (let info of one.list) {
                if (info.key === 'power') {
                    EnergyMgr.ins.changeEnergy(true, +info.num)
                } else {
                    Global.addPropsSetting(info.key, +info.num);
                }
            }
            /* 
             
            */
        }
        this.codeString = ''
        this.editBox.string = ''
    }
    // update (dt) {}
}
