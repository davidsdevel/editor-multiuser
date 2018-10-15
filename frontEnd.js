var net = require("net");

var Server = new net.Socket({
  host:"127.0.0.1",
  port:1000,
})
Server.on("connect", ()=>console.log("Server Connected"))