export default class Music {
  constructor() {
    this.bgmAudio = new Audio()
    this.bgmAudio.volume = 0.5;
    this.bgmAudio.loop = true
    this.bgmAudio.src  = 'static/audio/bgm.aac'
    this.playBgm();
  }
  playBgm() {
    this.bgmAudio.play()
  }
}
