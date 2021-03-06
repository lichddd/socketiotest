import io from 'socket.io-client'
import css from '@/css/cheat.css'
import config from '@/config'

let socket = io(`${config.url}/cheat`);

let dom=`<div class="msg"></div><input/>`;
export default class Cheat
{
  input=null
  msg=null
  constructor(el){
    el.className+=" cheat";
    el.innerHTML=dom;
    this.input=el.querySelector('input');
    this.msg=el.querySelector('.msg');
    this.input.addEventListener("keyup",
  (e)=>
  {
    if (e.key=="Enter") {
      socket.send(this.input.value);
    }
  });
    socket.on('connect', ()=>{

    });
    socket.on('message', (msg)=>{
        let p=document.createElement('p');
        p.innerHTML=`${msg.name}:${msg.data}`;
        this.msg.append(p);
    });
  }
  getSocket(){
    return socket;
  }
}
