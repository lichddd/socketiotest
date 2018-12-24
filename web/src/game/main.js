import io from 'socket.io-client'

import './libs/ease'
import Player from './player/index'
import Boss from './npc/boss'
import BackGround from './runtime/background'
import GameInfo   from './runtime/gameinfo'
import Music      from './runtime/music'
import config from '@/config'

const screenWidth = 480
const screenHeight = 640
/**
 * 游戏主函数
 */
export default class Main {
  constructor(canvas,n="") {
    // wx.setPreferredFramesPerSecond(60);
    this.canvas=canvas;
    this.frame=0;
    this.score=0;
    this.defance=0;
    this.music= new Music();
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    this.stage = new createjs.Stage(this.canvas);
    this.init();

    this.socket_game = io(`${config.url}/game`);
    this.socket_game.emit('login',n);
    this.socket_game.on('join', (data)=>{
        window.main.join(data);
    });
    this.socket_game.on('leave', (data)=>{
        window.main.leave(data);
    });
    this.socket_game.on('move', (data)=>{
        window.main.move(data);
    });
    this.socket_game.on('position', (data)=>{
        window.main.position(data);
    });
  }
  init(user_info=""){
    this.bg = new BackGround();
    this.stage.addChild(this.bg);
    this.player = new Player(this.stage,user_info.avatarUrl);
    this.friends=[];
    this.stage.addChild(this.player);
    this.boss = new Boss(this.stage);
    this.stage.addChild(this.boss);
    this.gameinfo =new GameInfo();
    this.stage.addChild(this.gameinfo);
    window.requestAnimationFrame(
      this.TimerHandel.bind(this),
      this.canvas
    )
    let alock=false;
    let dlock=false;
    let wlock=false;
    let slock=false;
    window.addEventListener('keydown',(e)=>{
      if (e.key=="a") {
        if (alock) {
          return ;
        }
        alock=true;
        this.player.player.speedx=-5;
      }
      if (e.key=="d") {
        if (dlock) {
          return ;
        }
        dlock=true;
        this.player.player.speedx=5;
      }
      if (e.key=="w") {
        if (wlock) {
          return ;
        }
        wlock=true;
        this.player.player.speedy=-5;
      }
      if (e.key=="s") {
        if (slock) {
          return ;
        }
        slock=true;
        this.player.player.speedy=5;
      }

      this.socket_game.emit('move',{sx:this.player.player.speedx,sy:this.player.player.speedy});

    });

    window.addEventListener('keyup',(e)=>{
      if (e.key=="a") {
        alock=false;
        this.player.player.speedx=0;
      }
      if (e.key=="d") {
        dlock=false;
        this.player.player.speedx=0;
      }
      if (e.key=="w") {
        wlock=false;
        this.player.player.speedy=0;
      }
      if (e.key=="s") {
        slock=false;
        this.player.player.speedy=0;
      }


      this.socket_game.emit('move',{sx:this.player.player.speedx,sy:this.player.player.speedy});

    });
  }
  move(data)
  {
    let f=this.friends.find(value=>value.sid==data.id);
    f.player.speedx=data.sx;
    f.player.speedy=data.sy;

  }
  position(data)
  {
    let f=this.friends.find(value=>value.sid==data.id);
    f.player.x=data.x;
    f.player.y=data.y;

  }
  join(data)
  {
    let n=new Player(this.stage,null,data.name);
    n.sid=data.id;
    this.friends.push(n);
    this.stage.addChild(n);
  }
  leave(data)
  {
    this.stage.removeChild(this.friends.find(value=>value.sid==data.id));
    this.friends=this.friends.filter(f=>{
      if (f.sid==data.id) {
        return false;
      }
      return true;
    })
  }
  TimerHandel() {
    this.frame++;
    if(this.frame>999999999){
      this.frame=0;
    }
    if (this.frame % 30 === 0) {
      this.player.shoot();
      this.socket_game.emit('position',{x:this.player.player.x,y:this.player.player.y});
    }
    if (this.frame % 30 === 0) {
      this.friends.forEach(f=>f.shoot());
    }
    this.bg.update();

    this.player.update(true);
    this.friends.forEach(f=>f.update(true));

    this.boss.update(true);
    this.collisionDetection();
    this.stage.update();
    this.gameinfo.updateScore(this.score,this.defance);
    window.requestAnimationFrame(
      this.TimerHandel.bind(this),
      this.canvas
    )
  }
  isCollideWith(rectObj,pointObj) {
    let spX = pointObj.x;
    let spY = pointObj.y;
    return !!(spX >= rectObj.x - rectObj.width / 2
      && spX <= rectObj.x + rectObj.width / 2
      && spY >= rectObj.y - rectObj.height / 2
      && spY <= rectObj.y + rectObj.height / 2)
  }
  collisionDetection() {
    let that = this;
    let pp={x:this.player.player.x,y:this.player.player.y};
    let br={x:this.boss.player.x,y:this.boss.player.y,width:this.boss.player.width,height:this.boss.player.height};
    this.player.bullet.list.forEach((bu) => {
      if ( this.isCollideWith(br,bu)&&!bu.isdie) {
        bu.die();
        this.score += 1;
      }
    });
    this.boss.bullets.forEach((bu) => {
      bu.list.forEach((b) => {
        if ( this.isCollideWith(b,pp)&&!b.isdie) {
          b.die();
          this.defance += 1;
        }
      });
    });
  }
}
