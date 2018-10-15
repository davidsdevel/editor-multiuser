const webSocketServer = require('websocket').server;
const http = require('http');

class SocketServer {
	contructor(){
	}
	init({port}){
		this.serverPort = port;
		this.connection;
		this.clients = {};
		this.clientsId = [];
	}
	run(){
		let that = this;
		this.server = http.createServer((req, res) => {}).listen(this.serverPort, function() {
		console.log(`${new Date().toLocaleString()} Server is listening on port ${that.serverPort}`);
		});
		/**
		 * WebSocket server
		 */
		this.socketServer = new webSocketServer({
		  httpServer: that.server
		});
		this.onRequest(this._connect);
	}
	onRequest(callback){
		if (typeof callback === "function") {
			this.socketServer.on("request", callback);
		} else {
			throw new Error("Callback must be a function");
		}
	}
	_handleMsg(str){
		if (str.startsWith("{")) {
			let parsed = JSON.parse(str);
			switch(parsed.request){
				case "projects":
					let projects = require("./data/projects.json");
					this.connection.send(projects);
					break;
				case "code":
					break
				case "newProject":
					break
				case "folders":
					break
				default:
					break
			}
		}
	}
	_connect(req){
		this.connection = req.accept(null, req.origin);
		let index;
		var findId = true;
		while (findId) {
			let id = "";
			for (var i = 3; i >= 0; i--) {
				id += String(Math.floor(Math.random()*10));
			}
			if (!this.clients[id]) {
				this.clients[id] = {
					connection:this.connection
				};
				this.clientsId.push(id);
				index = id;
				findId = false;
			}
		}
		console.log(`Connection accepted. Id User: ${index}`);
		this._onMessage();
		this._onClose(index);
	}
	_onMessage(){
		this.connection.on("message", msg =>{
			this._handleMsg(msg.utf8Data);
		})
	}
	_onClose(index){
		this.connection.on('close', conn =>{
		    console.log(`${new Date().toLocaleString()} Disconnected. User Id: ${index}`);
		    // remove user from the list of connected clients
		    this.clientsId = this.clientsId.filter(e=>{
		      return e !== index;
		    })
		    delete this.clients[index];
		    // push back user's color to be reused by another user
		});
	}
	sendAll(input){
		for (var i = 0; i < this.clientsId.length; i++) {
			this.clients[this.clientsId[i]].connection.send(input);
		} 
	}
}
module.exports = SocketServer;