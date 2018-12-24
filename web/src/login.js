
import css from '@/css/login.css'
import config from '@/config'


let dom=`<p>请输入名称并回车</p><input maxlength="12" />`;
export default class Cheat
{
  input=null
  constructor(socket){
    return new Promise((resolve,reject)=>{
      let el=document.createElement("div");
      el.className+=" login";
      el.innerHTML=dom;
      this.input=el.querySelector('input');
      this.input.addEventListener("keyup",
    (e)=>
    {
      if (e.key=="Enter") {
        let n=this.input.value
        socket.emit('login',n);
        document.querySelector('body').removeChild(el);
        resolve(n);
      }
    });
      socket.on('connect', ()=>{

      });
      document.querySelector('body').append(el);
    })

  }
}
