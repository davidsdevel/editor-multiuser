"use strict";
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'editor-multiuser';
// Port where we'll run the websocket server
// websocket and http servers
const express = require("express");
const app = express();
const SocketServer = require("./SocketServer");
const {getFiles, createProject} = require("./FileActions");
const {join} = require("path");
/*
var socket = new SocketServer();
socket.init({
  port:1337
})
socket.run();
*/

// App Server
app.use(express.static(join(__dirname, "public")));
app
  .get("/projects/:id", ({params}, res)=>{
    let {id} = params;

    if(id === "all")
      res.json(require("./data/projects"));
    else 
      res.json(getFiles("projects/"+id));
  })
  .get("/create", async ({query}, res) => {
    try {
      let {name} = query;
      let data = await createProject(name);
      res.json(data);
    } catch(err) {
      res.status(500).send("Error");
    }
  })
  .get("*.jsx", (req, res)=>{
    res.setHeader("Content-Type", "text/babel");
    res.sendFile(req.url);
  })
  .get("*", (req, res) => {
    res.sendFile(req.url);
  })
  .listen(5004,()=>console.log("Listenin on port 5004"))