var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

  app.listen(3000);
var path = require('path');

var CONTENT_TYPE = "text/plain";

function handler(request, response) {
  var filePath = '.' + request.url;
  if (filePath == './')
    filePath = './index.html';

  var extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
    break;
    case '.css':
      contentType = 'text/css';
    break;
    case '.png':
      contentType = 'image/png';
    break;
  }
  fs.readFile(filePath, function(error, content) {
       if (error) {
          response.writeHead(500);
          response.end();
       }
       else {
          response.writeHead(200, { 'Content-Type': contentType });
          response.end(content, 'utf-8');
          }
  });
}

var NAMES = [];
io.sockets.on('connection', function (socket) {
  
     socket.on("addUser", function(d){
          console.log(d["name"] + " has joined the club!");
          socket.name = d["name"];
          NAMES.push(d["name"]);
          io.sockets.emit("updateUsers", NAMES);
     });     
     
     socket.on("sentFromClient", function(data){
          var sender = socket.name;
          console.log(sender + ": " + data["data"]);
          io.sockets.emit("sentFromServer", {name: sender, word: data["data"]});
     });

     socket.on('disconnect', function () {
          console.log(socket.name + " has disconnected");
          NAMES.splice(NAMES.indexOf(socket.name), 1);
          io.sockets.emit("updateUsers", NAMES);
     });
});
