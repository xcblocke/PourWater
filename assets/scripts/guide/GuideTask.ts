//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 http://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 http://web3incubators.com/kefu.html
export const task = {
    name: '【任务引导流程】',
    debug: true,
    steps: [
        {
            order: 0,  //数组索引为0
            name: 'GuideTask',
            command: {
                cmd: 'movefinger',
                text: '请选中这个试管',
                args: 'game/GameView/bgColor/cupBg/cupMgr/layout_v/layout_h_0/img_cup',
                index:0
            },
            delayTime: 0.1,
            onStart(callback) {
                callback();
            },
            onExcute(callback) {
                callback();
            },
            onEnd(callback) {
                callback();
            }
        },
        {
            order: 1,
            name: 'GuideBag',
            command: {
                cmd: 'movefinger',
                text: '将相同颜色的水，倒满同一个试管中则过关',
                args: 'game/GameView/bgColor/cupBg/cupMgr/layout_v/layout_h_0/img_cup,img_cup',
                index:1
            },
            delayTime: 0.2,
            onStart(callback) {
                callback();
            },
            onExcute(callback) {
                callback();
            },
            onEnd(callback) {
                callback();
            }
        }
    ]
}