const {server:webSocketServer} = require('websocket');
const {writeFileSync, unlinkSync} = require("fs");
const {join} = require("path");

const http = require('http');

const tempFilesPath = join(__dirname, "..", "temp");

var _this = null;

class SocketServer {
	constructor({port}){
		this.serverPort = port;
		this.connection;
		this.clients = {};
		this.clientsId = [];

		_this = this;
	}
	run(){
		let that = this;
		this.server = http.createServer().listen(this.serverPort, () =>
			console.log(`${new Date().toLocaleString()} Server is listening on port ${that.serverPort}`)
		);
		/**
		 * WebSocket server
		 */
		this.socketServer = new webSocketServer({
			httpServer: that.server
		});
		this.onRequest(this._connect);
	}
	appendFile(userID, filename) {
		const client = this.clients[userID];
		var exists = false;
		for (let i = 0; i < client.files.length; i++) {
			const name = client.files[i];
			if (name === filename) {
				exists = true;
				break;
			}
		}
		if (!exists)
			client.files.push(filename);
	}
	onRequest(callback){
		if (typeof callback === "function") {
			this.socketServer.on("request", callback);
		} else {
			throw new Error("Callback must be a function");
		}
	}
	_handleMsg(str) {
		const {content, ID} = JSON.parse(str);

		writeFileSync(join(tempFilesPath, `${ID}.file`), content);

		this.sendAll(str);
	}
	_connect(req){
		_this.connection = req.accept(null, req.origin);
		let index;
		var findId = true;
		var id = "";

		while (findId) {
			for (var i = 0; i < 4; i++) {
				id += String(Math.floor(Math.random() * 10));
			}
			if (!_this.clients[id]) {
				_this.clients[id] = {
					connection: _this.connection,
					files: []
				};
				_this.clientsId.push(id);
				index = id;
				findId = false;
			}
		}
		console.log(`Connection accepted. Id User: ${index}`);

		_this.connection.send(id);
		_this._onMessage();
		_this._onClose(index);
	}
	_onMessage(){
		this.connection.on("message", msg =>{
			this._handleMsg(msg.utf8Data);
		});
	}
	_onClose(index){
		this.connection.on('close', conn =>{
			console.log(`${new Date().toLocaleString()} Disconnected. User Id: ${index}`);
			// remove user from the list of connected clients
			this.clientsId = this.clientsId.filter(e=>{
			  return e !== index;
			});

			this.clients[index].files.forEach(e => {
				console.log(`Deleted temp file: ${e}`);
				unlinkSync(join(tempFilesPath, e));
			});
			
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