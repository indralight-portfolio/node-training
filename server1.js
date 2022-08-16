const http = require('http');

http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h1>Hello Node</h1>');
    res.end('<p>Hello Server1</p>');
  })
  .listen(8080)
  .on('listening', () => {
    console.log('8080번 포트에서 서버 대기');
  })
  .on('error', () => {
    console.error();
  });

http
  .createServer((req, res) => {
    console.log(req.url, req.headers.cookie);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.writeHead(200, { 'Set-Cookie': 'mycookie=set' });
    res.write('<h1>Hello Node</h1>');
    res.end('<p>Hello Server2</p>');
  })
  .listen(8081)
  .on('listening', () => {
    console.log('8081번 포트에서 서버 대기');
  })
  .on('error', () => {
    console.error();
  });
