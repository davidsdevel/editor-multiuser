"use strict";
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'editor-multiuser';
// Port where we'll run the websocket server
// websocket and http servers
const express = require("express");
const app = express();
const SocketServer = require("./lib/SocketServer");
const {getFiles, createProject, getFileContent, createFile} = require("./lib/FileActions");
const {join} = require("path");
const {existsSync, readFileSync} = require("fs");
const Debug = require("./lib/DebugConsole");
const Database = require("./lib/DevDatabase");

const PORT = process.env.PORT || 5004;

const DB = new Database();

var socket = new SocketServer({
	port:1337
});
socket.run();

// App Server
app.use(express.static(join(__dirname, "public")));

app
	.get("/file/:projectID/:fileID/:userID", async ({params}, res) => {
		const {projectID, fileID, userID} = params;
		try {
			if (fileID === "all")
				res.json(await getFiles(projectID));
			else {
				const file = join(__dirname, "temp", `${fileID}.file`);

				socket.appendFile(userID, `${fileID}.file`);

				if (existsSync(file))
					res.send(readFileSync(file));
				else
					res.send(await getFileContent(fileID));
			}
		} catch(err) {
			console.log(err);
			res.status(500).send("Cannot Get File");
		}
	})
	.get("/createfile/:projectid/:name", async ({params}, res) => {
		try {
			const {name, projectid} = params;
			await createFile(projectid, name);
			res.json({
				status:"OK",
				message:"File Created"
			});
		} catch(err) {
			console.log("Error > ", err);
			res.status(500).json({
				status:"Server Error",
				message:"Cannot Create File"
			});
		}
	})
	.get("/projects/:id", async ({params}, res) => {
		try {
			const {id} = params;
			const projectLog = id === "all" ? "All Projects" : `Project: ${id}`;
			Debug.ServerLog(`Fetching ${projectLog}`);

			if(id === "all") {
				const projects = await DB.fetch("projects");
				res.json(projects);
			}
			else {
				const rows = await DB.fetch("projects", ["ID"]);

				var exists = false;
				for(let i = 0; i < rows.length + 1; i++) {
					const row = rows[i];
					if (row.ID === id) {
						exists = true;
						break;
					}
				}

				if(exists)
					res.send();
				else
					res.status(500).json({
						status:"dont-exists",
						message:"Project Does not Exists"
					});
			}
		} catch(err) {
			res.status(500).json(err);
		}
	})
	.get("/create/:name", async ({params}, res) => {
		try {
			const {name} = params;
			Debug.ServerLog("Creating New Project");
			await createProject(name);
			Debug.ServerLog("> Project Created");
			res.send();
		} catch(err) {
			Debug.ServerLog("Error creating the project");
			Debug.ServerLog(err);
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
	.listen(5004,() => Debug.ServerLog("Run on Port: "+ PORT));