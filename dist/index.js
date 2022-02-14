"use strict";

var _socket = require("socket.io");

var _http = _interopRequireDefault(require("http"));

var _uuid = require("uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require("express");

var notes = [];
var app = express();

var server = _http["default"].createServer(app);

var io = new _socket.Server(server);
app.use(express["static"](__dirname + "/public"));
io.on("connection", function (socket) {
  console.log("new connnection:", socket.id);
  socket.emit("server:loadnotes", notes);
  socket.on("client:newnote", function (newNote) {
    var note = _objectSpread(_objectSpread({}, newNote), {}, {
      id: (0, _uuid.v4)()
    });

    console.log(note);
    notes.push(note);
    io.emit("server:newnote", note);
  });
  socket.on("client:deletenote", function (noteId) {
    notes = notes.filter(function (note) {
      return note.id !== noteId;
    });
    io.emit("server:loadnotes", notes);
  });
  socket.on("client:getnote", function (noteId) {
    var note = notes.find(function (note) {
      return note.id === noteId;
    });
    socket.emit("server:selectednote", note);
  });
  socket.on("client:updatenote", function (updatedNote) {
    notes = notes.map(function (note) {
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