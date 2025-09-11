const express = require("express");
const ejs = require("ejs");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "public"));

app.engine("html", ejs.renderFile);

app.use("/", (req, res) => {
    res.render('index.html');
});

server.listen(3000, () => {
  console.log("SERVIDOR RODANDO EM: http://localhost:3000");
});

let messages = [];

io.on('connection', socket => {

  console.log('ID de usuário conectado: ' + socket.id);

  socket.emit('previousMessage', messages);

  socket.on('sendMessage', data => {
    //entrada de mensagens: de cima pra baixo, fazendo a pilha
    messages.push(data);

    socket.broadcast.emit('receivedMessage', data);
  });
});