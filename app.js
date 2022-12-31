const express = require("express");

const app = express();
const port = 3000;

app.get("/", (_, res) => {
  res.sendFile(__dirname + "/index.html"); //index.html을 화면에 보여주는 것
});

const server = app.listen(port, () => {
  console.log("Express listening on port", port); //socket서버를 붙이기 위해 server변수로 만듦
});

const listen = require("socket.io");
const io = listen(server);

const color = ["yellow", "green", "red", "blue", "white", "black"]; //사용자 생성

io.on("connection", (socket) => {
  const username = color[Math.floor(Math.random() * 6)]; //사용자 랜덤 생성
  socket.broadcast.emit("join", { username }); //누구누구님 들어왔습니다. 내가 입장한거 나는 안보임
  socket.on("client message", (data) => {
    //2. 서버가 받아서 client메세지 대기
    //받는 쪽은 soket.on으로 받음

    io.emit("server message", {
      //socket.broadcast.emit은 나를 제외하고 뿌림  ex)00님이 입장하셨습니다.
      username,
      message: data.message,
    }); //3. 전체사용자에게 서버 메세지로 뿌림
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", { username });
  });
});
