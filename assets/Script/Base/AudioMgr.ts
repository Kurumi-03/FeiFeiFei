import {
  _decorator,
  AudioClip,
  AudioSource,
  Component,
  director,
  Node,
  resources,
} from "cc";
import Singleton from "./Singleton";
const { ccclass, property ,executionOrder} = _decorator;

@ccclass("AudioMgr")
@executionOrder(-2)
export class AudioMgr extends Singleton<AudioMgr> {
  @property(AudioClip)
  InitLongAudio: AudioClip | null = null;
  @property(AudioClip)
  ShortAudio: AudioClip[] = [];
  @property(AudioClip)
  LongAudio: AudioClip[] = [];
  @property(AudioClip)
  diceSound: AudioClip | null = null; // 這裡假設你的骰子音效名稱是 diceSound
  private _ShortSource: AudioSource;
  private _LongSource: AudioSource;
  onLoad() {
    AudioMgr._instance = this;
    
    this._ShortSource = this.node.addComponent(AudioSource);
    this._LongSource = this.node.addComponent(AudioSource);
  }

  start() {
    try{
      if(this.InitLongAudio){
        this._LongSource.clip = this.InitLongAudio;
      }
      
      this._LongSource.play();
      this._LongSource.loop = true;
      this._LongSource.volume = 0.5;
    }catch(e){

    }
    
  }

  update(deltaTime: number) {}

  /**
   * @en
   * play short audio, such as strikes,explosions
   * @zh
   * 播放短音频,比如 打击音效，爆炸音效等
   * @param sound clip or url for the audio
   * @param volume
   */
  playOneShot(sound: string, volume: number = 1.0) {
    try {
      for (let m of this.ShortAudio) {
        if (m.name == sound) {
          this._ShortSource.playOneShot(m, volume);
          break;
        }
      }
    } catch (e) {}
  }
  /**
   * @en
   * play long audio, such as the bg music
   * @zh
   * 播放长音频，比如 背景音乐
   * @param sound clip or url for the sound
   * @param volume
   */
  play(sound: string | AudioClip, volume: number = 1.0) {
    try {
      for (let m of this.LongAudio) {
        if (m.name == sound) {
          this._LongSource.clip = m;
          this._LongSource.play();

          this._LongSource.volume = volume;
          break;
        }
      }
    } catch (e) {}
  }

  /**
   * stop the audio play
   */
  stop() {
    this._LongSource.stop();
  }
  StopOneShot() {
    this._ShortSource.stop();
  }
  LongBtn(volume: number) {
    try {
      this._LongSource.volume = volume;
    } catch (e) {}
  }
  ShortBtn(volume: number) {
    try {
      this._ShortSource.volume = volume;
    } catch (e) {}
  }
  stopDelay() {
    try{
      this.schedule(
        function () {
          this._LongSource.volume -= 0.1;
        },
        0.1,
        10,
        0
      );
    }catch(e){

    }
    
  }

  /**
   * pause the audio play
   */
  pause() {
    try{
      this._LongSource.pause();
    }catch(e){

    }
    
  }

  /**
   * resume the audio play
   */
  resume() {
    try{
      this._LongSource.play();
    }catch(e){

    }
    
  }
}
