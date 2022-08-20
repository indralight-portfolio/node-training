const SocketIO = require('socket.io');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cookie = require('cookie-signature');

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: '/socket.io' });
  app.set('io', io);
  const room = io.of('/room');
  const chat = io.of('/chat');

  io.use((socket, next) => {
    cookieParser(process.env.COOKIE_SECRET)(
      socket.request,
      socket.request.res,
      next
    );
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  room.on('connection', (socket) => {
    console.log('room 네임스페이 접속');
    socket.on('disconnect', () => {
      console.log('room 네임스페이 접속 해제');
      clearInterval(socket.interval);
    });
  });

  chat.on('connection', (socket) => {
    console.log('chat 네임스페이 접속');
    const req = socket.request;
    const {
      headers: { referer },
    } = req;
    const roomId = referer
      .split('/')
      [referer.split('/').length - 1].replace(/\?.+/, '');
    socket.join(roomId);
    socket.to(roomId).emit('join', {
      user: 'system',
      chat: `${req.session.color}님이 입장하셨습니다.`,
    });

    socket.on('disconnect', () => {
      console.log('chat 네임스페이스 접속 해제');
      socket.leave(roomId);
      const currentRoom = socket.adapter.rooms[roomId];
      const userCount = currentRoom ? currentRoom.length : 0;
      if (userCount === 0) {
        //const signedCookie = req.signedCookie['connect.sid'];
        //const connectSID = cookie.sign(signedCookie, process.env.COOKIE_SECRET);
        axios
          .delete(`http://localhost:8005/room/${roomId}`)
          .then(() => {
            console.log('방 제거 요청 성공');
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        socket.to(roomId).emit('exit', {
          user: 'system',
          chat: `${req.session.color}님이 퇴장하셨습니다.`,
        });
      }
    });
  });

  // const wss = new WebSocket.Server({ server });

  // wss.on('connection', (ws, req) => {
  //   const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  //   console.log('새로운 클라이언트 접속', ip);

  //   ws.on('message', (message) => {
  //     console.log(message.toString());
  //   });
  //   ws.on('error', (error) => {
  //     console.error(err);
  //   });
  //   ws.on('close', () => {
  //     console.log('클라이언트 접속 해제', ip);
  //     clearInterval(ws.interval);
  //   });
  //   ws.interval = setInterval(() => {
  //     if (ws.readyState == ws.OPEN) {
  //       ws.send('서버에서 클라이언트로 메시지를 보냅니다.');
  //     }
  //   }, 3000);
  // });
};
