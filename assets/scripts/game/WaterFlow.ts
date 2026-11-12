//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html
import { dft_lingWidth } from "../enum/Enums";

/**
 * 倾倒的水流
 */
export class WaterFlow extends cc.Graphics{
    onLoad(){
        this.lineWidth = dft_lingWidth; // 设置默认线宽
        this.lineCap = cc.Graphics.LineCap.ROUND; // 设置线帽为圆形
    }
    private _toPt:cc.Vec2 = cc.v2() // 水流结束点的私有变量
    public get toPt(){
        return this._toPt // 获取水流结束点
    }
    public set toPt(val){
        this._toPt = val; // 设置水流结束点
        this.clear(); // 清除绘图
        this.moveTo(this.from.x,this.from.y) // 移动绘图到起点
        this.lineTo(this._toPt.x,this._toPt.y); // 画一条线到结束点
        this.stroke(); // 绘制线条
    }

    private from:cc.Vec2 = cc.v2(); // 水流起点的私有变量
    /**
     * 倒水水流动画
     * @param from 起点
     * @param to 终点
     * @param dur 持续时间
     * @param isTail 是否为最后一束水
     * @param onComplete 动画完成后的回调函数
     */
    public playFlowAni(from:cc.Vec2,to:cc.Vec2,dur:number,isTail:boolean,onComplete:Function){
        
        this.clear(); // 清除绘图
        
        let flow:WaterFlow = this
        if(isTail){
            this.from = to; // 如果是最后一束水，则将起点设置为终点
        }else{
            this.from = from; // 否则将起点设置为给定的起点
        }
        this.moveTo(this.from.x,this.from.y) // 移动绘图到起点
        let tw = cc.tween(flow)
            .set({toPt:from})
            .to(dur,{toPt:to})
            .call(onComplete)
            .start();
    }

    /**
     * 设置线条缩放比例
     * @param scale 缩放比例
     */
    public setLineScale(scale:number){
        this.lineWidth = dft_lingWidth*scale; // 根据默认线宽和给定的比例设置线宽
    }
}