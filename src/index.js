const express = require("express");
import { Server as WebSockerServer } from "socket.io";
import http from "http";
import { v4 as uuid } from "uuid";

let notes = [];

const app = express();
const server = http.createServer(app);
const io = new WebSockerServer(server);

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  console.log("new connnection:", socket.id);

  socket.emit("server:loadnotes", notes);

  socket.on("client:newnote", (newNote) => {
    const note = { ...newNote, id: uuid() };
    console.log(note);
    notes.push(note);
    io.emit("server:newnote", note);
  });

  socket.on("client:deletenote", (noteId) => {
    notes = notes.filter((note) => note.id !== noteId);
    io.emit("server:loadnotes", notes);
  });

  socket.on("client:getnote", (noteId) => {
    const note = notes.find((note) => note.id === noteId);
    socket.emit("server:selectednote", note);
  });

  socket.on("client:updatenote", (updatedNote) => {
    notes = notes.map((note) => {
      if (note.id === updatedNote.id) {
        note.title = updatedNote.title;
        note.description = updatedNote.description;
      }

      return note;
    });
    io.emit("server:loadnotes", notes);
  });
});

server.listen(3000);
console.log("app run on serbver", 3000);
