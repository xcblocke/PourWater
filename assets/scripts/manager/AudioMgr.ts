/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-07-16 21:30:33
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-07-19 22:01:19
 * @FilePath: \倒水游戏重构\assets\scripts\manager\AudioMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

// import { AudioClip, AudioSourceComponent, _decorator } from "cc";
import { Global } from "../Global";
import ResMgr from "./ResMgr";
import { SoundStatus } from "../enum/Enums";

/**
 * Audio Manager Class
 */
export class AudioMgr {
  /**
   * 播放单个音频剪辑
   */
  private _audioComp: cc.AudioSource = null;
  /**
   * 播放循环音频剪辑
   */
  private _audioLoopComp: cc.AudioSource = null;
  /**
   * 当前正在播放的循环音频剪辑的名称。
   */
  private _curLoopAudioName: string = "";
  /**
   * AudioMgr 类的单例实例。
   */
  private static _ins: AudioMgr = null!;

  /**
   * 返回 AudioMgr 类的单例实例。
   */
  public static get ins() {
    if (!this._ins) {
      this._ins = new AudioMgr();
      this._ins.initAudio();
    }

    return this._ins;
  }
  /**
   * 初始化 AudioMgr 类使用的音频组件。
   */
  private initAudio() {
    this._audioComp = new cc.AudioSource();
    this._audioComp.loop = true;
    this._audioLoopComp = new cc.AudioSource();
    this._audioLoopComp.loop = true;
    this._audioLoopComp.volume = 0.3;
  }

  /**
   * 播放音乐
   * @param {string} audio 音频文件名
   */
  public async playMusic(audio: string) {
    if (Global.bgm == SoundStatus.off) return;
    if (this._audioComp.clip) {
      this._audioComp.play();
      return;
    }

    let clip = await ResMgr.ins.getClip(audio);
    this._audioComp.volume = 0.8;
    this._audioComp.clip = clip;
    this._audioComp.play();
  }

  /**
   * 停止播放音乐
   */
  public stopMusic() {
    this._audioComp.stop();
  }

  /**
   * 播放音效
   * @param {string} audio 音频文件名
   * @param {number} scale 音量缩放比例
   */
  public async playSound(audio: string, scale = 1) {
    if (Global.sound == SoundStatus.off) return;
    if(this._audioComp)this.stopMusic()
    let clip = await ResMgr.ins.getClip(audio);
    var audioID = cc.audioEngine.play(clip, false, scale);
  }

  /**
   * 播放循环音效
   * @param {string} audio 音频文件名
   */
  public async playLoopSound(audio: string): Promise<void> {
    if (Global.sound == SoundStatus.off) return;
    let clip = await ResMgr.ins.getClip(audio);
    this._audioLoopComp.stop();
    this._audioLoopComp.clip = clip;
    this._audioLoopComp.play();
    this._curLoopAudioName = audio;
  }

  /**
   * 停止播放循环音效
   */
  public async stopLoopSound(): Promise<void> {
    this._audioLoopComp.stop();
  }

  /**
   * 获取当前循环音效的文件名
   * @returns {string} 当前循环音效的文件名
   */
  public get curLoopAudioName(): string {
    return this._curLoopAudioName;
  }

  /**
   * 判断是否正在播放循环音效
   * @returns {boolean} 是否正在播放循环音效
   */
  public isLoopAudioPlaying(): boolean {
    return this._audioLoopComp.isPlaying;
  }

  // 指定时间播放音效
  public async playSoundAtTime(audio: string, time: number) {
    if (Global.sound == SoundStatus.off) return;
    let clip = await ResMgr.ins.getClip(audio);
    var audioID = cc.audioEngine.play(clip, false, 1);
    this._audioComp.clip = clip;
    this._audioComp.play();
    this._audioComp.scheduleOnce(() => {
      cc.audioEngine.stop(audioID);
      this._audioComp.stop();
    }, time*2);
  }
}
