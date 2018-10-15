"use strict";
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-debug';
// Port where we'll run the websocket server
var webSocketsServerPort = 1337;
// websocket and http servers
const webSocketServer = require('websocket').server;
const http = require('http');
const express = require("express")
const app = express();
const {join} = require("path");
var exec = require('child_process').exec, child;
const {writeFileSync, readFileSync, appendFileSync, mkdirSync, existsSync, writeFile, unlinkSync} = require("fs")
/**
 * Global variables
 */
// list of currently connected clients (users)
var clients = {};
var clientsId = [];
/**
 * HTTP server
 */
var server = http.createServer((request, response) => {})
  .listen(webSocketsServerPort, function() {
    console.log(`${new Date().toLocaleString()} Server is listening on port ${webSocketsServerPort}`);
  });
/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
  // WebSocket server is tied to a HTTP server. WebSocket
  // request is just an enhanced HTTP request. For more info 
  // http://tools.ietf.org/html/rfc6455#page-6
  httpServer: server
});
// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
  var index;
  console.log(`${new Date().toLocaleString()} Connection from origin: ${request.origin}.`);
  // accept connection - you should check 'request.origin' to
  // make sure that client is connecting from your website
  // (http://en.wikipedia.org/wiki/Same_origin_policy)
  var connection = request.accept(null, request.origin);
  // we need to know client index to remove them on 'close' event
  var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var findId = true;
  while (findId) {
    let id = "";
    for (var i = 3; i >= 0; i--) {
      id += String(Math.floor(Math.random()*10));
    }
    if (!clients[id]) {
      clients[id] = {
        connection
      };
      clientsId.push(id);
      index = id;
      findId = false;
    }
  }
  console.log(`Connection accepted. Id User: ${index}`);
  // user sent some message

  connection.on('message', message => {
	console.log(message.utf8Data);
	/*var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let id = "";
    for (var i = 20; i >= 0; i--) {
      id += letters[Math.floor(Math.random()*53)];
    }*/
    let id = "test.js"
	writeFile(join(__dirname, `/${id}`), message.utf8Data, ()=>{
		// Creamos la función y pasamos el string pwd 
		// que será nuestro comando a ejecutar
		child = exec('node test.js',
		// Pasamos los parámetros error, stdout la salida 
		// que mostrara el comando
		  function (error, stdout, stderr) {
		    // Imprimimos en pantalla con console.log

		    connection.send(stdout, stderr);
		    // controlamos el error
		    if (error !== null) {
		      connection.send(String(error).replace(/^.*\^\n\n/gm, ""));
		    }
		});
	});
  });
  // user disconnected
  connection.on('close', function(connection) {
      console.log(`${new Date().toLocaleString()} Disconnected. User Id: ${index}`);
      // remove user from the list of connected clients
      clientsId = clientsId.filter(e=>{
        return e !== index;
      })
      delete clients[index];
      // push back user's color to be reused by another user
  });
});
// App Server
app
  .get("/", (req, res)=>{
    res.sendFile(join(__dirname, "public", "debug.html"))
  })
  .listen(5001,()=>console.log("Listenin on port 5001"))