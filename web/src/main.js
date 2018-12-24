

import Cheat from './cheat'
import '@/css/main.css';
window.cheat=new Cheat(document.querySelector("#cheat"));


import './game/plugin/Math'

import Main from './game/main'

import Login from './login'
new Login(window.cheat.getSocket()).then((n)=>{

window.main = new Main(document.querySelector('#canvas'),n);


});
