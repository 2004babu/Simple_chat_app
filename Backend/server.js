
const express = require("express");
const path = require("path");
const app = express();


const server = app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

let socketsConected = new Set();
const io = require("socket.io")(server);
app.use(express.static(path.join(__dirname, "./public")));
io.on("connection", onConnected);

function onConnected(socket) {
  socketsConected.add(socket.id);
  io.emit("clients-total", socketsConected.size);
  socket.on("disconnect", () => {
    socketsConected.delete(socket.id);
    io.emit("clients-total", socketsConected.size);
  });
  socket.on('message',(data)=>{
    socket.broadcast.emit('chat-message',data)
  })
  socket.on('feedBack',(data)=>{
    socket.broadcast.emit('feedBack',data)
  })
}

