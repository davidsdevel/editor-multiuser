const {lstatSync, readdirSync, writeFile, readFileSync, appendFileSync, mkdir, existsSync} = require("fs");
const {basename, join} = require("path");
const Database = require("./DevDatabase");

const DB = new Database();

class TestDatabase {
	static getFileContent(fileID) {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await DB.fetch("files", ["ID", "content"]);
				var content;
				for (let i = 0; i < data.length; i++) {
					const file = data[i];
					if (file.ID == fileID) {
						content = file.content;
						break;
					}
				}
				resolve(content);
			} catch(err) {
				reject(err);
			}
		});
	}
	static createFile(projectID, filename, path) {
		return new Promise(async (resolve, reject) => {
			try {
				const split = filename.split(".");
				var type;
				switch(split[split.length - 1]){
					case "json":
						type = "application/json";
						break;
					case "html":
						type = "text/html";
						break
					case "css":
						type = "text/css";
						break;
					case "js":
						type = "text/javascript";
						break;
					case "jsx":
						type = "text/babel";
						break;
					case "vue":
						type = "text/vue";
						break;
					default:
						type = "text/plain";
						break;
				}
				await DB.push("files", {
					filename,
					path,
					projectID,
					type,
					content: ""
				});
				resolve();
			} catch(err) {
				reject(err);
			}
		});
	}
	static saveFile(ID, content) {
		return new Promise(async (resolve, reject) => {
			try {
				await DB.update("files", ID, {content});
				resolve();
			} catch(err) {
				reject(err);
			}
		});
	}
	static createProject(projectName){
		return new Promise(async (resolve, reject) => {
			try {
				const projects = await DB.fetch("projects", ["ID"]);
				console.log(projects.length)
				var findId = true;
				var ID = "";
				var project;
				while (findId) {
					for (let i = 0; i < 4; i++) {
						ID += String(Math.floor(Math.random()*10));
					}
					console.log(ID)
					if (projects.length === 0) {
						project = {
							ID,
							name:projectName
						};
						findId = false;
					} else {
						var idMismatch = false;
						console.log(idMismatch)
						for (let i = 0; i < projects.length-1; i++) {
							const {ID: pID} = projects[i];
							if (ID === pID) {
								idMismatch = true;
								break;
							}
						}
						console.log(idMismatch)
						if (!idMismatch) {
							project = {
								ID,
								name:projectName
							};
							findId = false;
						}
						console.log(idMismatch)
					}
				}
				console.log("Push")
				await DB.push("projects", project);
				resolve();
			} catch(err) {
				reject(err);
			}
		});
	}
	static getFiles(projectID) {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await DB.fetch("files");

				resolve(data.filter(e => e.projectID === projectID).map(e => ({...e, content: undefined})));
			} catch(err) {
				reject(err);
			}
		});
	}
}
module.exports = TestDatabase;
