import path from 'path'
import http from 'http'
import socketio from 'socket.io'
import Koa from 'koa'
import koa_static from 'koa-static'
import proxy from 'koa-proxies'

const port=(process.env.NODE_ENV=="development"?8081:18080);
const socket_port=(process.env.NODE_ENV=="development"?8083:12345);
let app = new Koa();
let server=require('http').createServer(app.callback());
const io=socketio(socket_port);
app.use(koa_static(path.resolve('./web')));
app.use(proxy('/music163', {
  target: "http://music.163.com/",
  changeOrigin: true,
  rewrite: path => path.replace(/^\/music163/, ''),
  logs: true,
  headers: {
    'Accept': '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Referer': 'http://music.163.com',
    'Cookie': 'appver=2.0.2',
    'Host': 'music.163.com',
    // 'Cookie': cookie,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36',

  },
}))




app.listen(port, () => {
  console.log(`Koa is listening in ${port}`)
});
let io_cheat=io.of('cheat');
let cheats={};
io_cheat.on('connection', function (socket) {
  socket.on('login', function (data) {console.log(data);cheats[socket.id]=data;});
  socket.on('message', function (data) {console.log(data);socket.emit('message',{id:socket.id,name:cheats[socket.id],data});socket.broadcast.emit('message',{id:socket.id,name:cheats[socket.id],data});});
  socket.on('disconnect', function () {
    delete cheats[socket.id];
  });
});


let platers={};

let io_game=io.of('game');
let games={};
io_game.on('connection', function (socket) {


  socket.on('login', function (data) {



    games[socket.id]=data;
    socket.broadcast.emit('join',{id:socket.id,name:games[socket.id]});
    io_game.clients((error, clients) => {
      clients.forEach((c)=>{
        if (c!=socket.id) {
          socket.emit('join',{id:c,name:games[c]});
        }
      });
    });



  });
  socket.on('move', function (data) {socket.broadcast.emit('move',{id:socket.id,...data});});
  socket.on('position', function (data) {socket.broadcast.emit('position',{id:socket.id,...data});});
  socket.on('disconnect', function () { delete games[socket.id];socket.broadcast.emit('leave',{id:socket.id});});
});


export default {}
