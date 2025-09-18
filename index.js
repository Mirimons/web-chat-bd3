const express = require("express");
const ejs = require("ejs");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "public"));

app.engine("html", ejs.renderFile);

app.use("/", (req, res) => {
  res.render("index.html");
});

function connectDB() {
  let dbUrl = "mongodb+srv://mirimons:Miri2206@cluster0.odqjau9.mongodb.net/";

  mongoose.connect(dbUrl);

  mongoose.connection.on('error', console.error.bind(console, 'connection error: '));

  mongoose.connection.once('open', function callBack(){console.log('Conectou XD!')})
}

let messages = [];

connectDB();

let Message = mongoose.model('Message', {usuario: String, data_hora: String, mensagem: String});

Message.find({})
  .then(docs => {
    console.log('DOCS: ' + docs);
    messages = docs;
    console.log('MESSAGES: ' + messages);
  }).catch(error => {
    console.log('ERRO: ' + error);
  });

io.on("connection", (socket) => {
  console.log("ID de usuário conectado: " + socket.id);
  
  socket.emit("previousMessage", messages);
  
  socket.on("sendMessage", data => {
    //entrada de mensagens: de cima pra baixo, fazendo a pilha: a última mensagem que entra é a primeira que sai 

    // messages.push(data);
    // socket.broadcast.emit("receivedMessage", data);

    let message = new Message(data);
    
//Toda vez que chama um método de model, ele é assíncrono => bate no banco e volta, 
//o código tem que esperar essa resposta de milissegundos (se encurta esta resposta com o uso do .then)
    message.save()
      .then(
        socket.broadcast.emit('receivedMessage', data)
      ).catch(error => {
        console.log('Erro ' + error);
      })
  });
});

server.listen(3000, () => {
  console.log("SERVIDOR RODANDO EM: http://localhost:3000");
});