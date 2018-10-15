"use strict";
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'editor-multiuser';
// Port where we'll run the websocket server
// websocket and http servers
const express = require("express");
const app = express();
const SocketServer = require("./SocketServer");
const {join} = require("path")
var socket = new SocketServer();
socket.init({
  port:1337
})
socket.run();

// App Server
app.use(express.static(join(__dirname, "public")));
app
  .get("/projects", (req, res)=>{
    res.sendFile(join(__dirname, "public/createProject.html"))
  })
  .get("*.js",(req,res)=>{
    res.setHeader("Content-Type","text/javascript");
    res.sendFile(req.url);
  })
  .get("*.jsx", (req, res)=>{
    res.setHeader("Content-Type", "text/babel");
    res.sendFile(req.url);
  })
  .get("*.css",(req, res)=>{
    req.setHeader("Content-Type", "text/css");
  })
  .listen(5004,()=>console.log("Listenin on port 5000"))