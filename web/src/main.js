

// import Cheat from './cheat'
import '@/css/main.css';
// let main1= import('./main1')
// let socket = io('http://localhost:8081');
// socket.on('connect', function () {
//   socket.send('hi');
//
//   socket.on('message', function (msg) {
//     setTimeout(()=>{
//       socket.send('1');
//     },1000);
//   });
// });
// window.cheat=new Cheat(document.querySelector("#cheat"));


import './game/plugin/Math'

import Main from './game/main'
window.main = new Main(document.querySelector('#canvas'));
