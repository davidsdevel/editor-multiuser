const {lstatSync, readdirSync, writeFile, readFileSync, appendFileSync, mkdir, existsSync} = require("fs");
const {basename, join} = require("path");

	function createProject(projectName){
		return new Promise((resolve, reject) => {
			let projects = require("./data/projects.json");
			let findId = true;
			let id = "";
			
			while (findId) {
				for (let i = 3; i >= 0; i--) {
					id += String(Math.floor(Math.random()*10));
				}
				if (projects.length === 0) {
					projects.push({
							id,
							name:projectName
						});
						findId = false;
				} else {
					projects.forEach(e=>{
						if (e.id !== id) {
							projects.push({
								id,
								name:projectName
							});
							findId = false;
						}
					})
				}
			}
			writeFile(join(__dirname, "data/projects.json"), JSON.stringify(projects), (err) => {
				if (err) 
					reject(err);
				else {
					mkdir(join(__dirname, "projects", id), (err) => {
						if (err) 
							reject(err);
						else
							resolve(projects);
					});
				}
			});
		})
	}
	function getFiles(filename) {
		var stats = lstatSync(filename),
		    info = {
				path: filename,
				name: basename(filename)
		    };
		if (stats.isDirectory()) {
		    info.type = "folder";
		    info.children = readdirSync(filename).map(function(child) {
		        return getFiles(filename + '/' + child);
		    });
		} else {
			let split = info.name.split(".");
			switch(split[split.length - 1]){
				case "json":
					info.type = "application/json"
					break;
				case "html":
					info.type = "text/html";
					break
				case "css":
					info.type = "text/css";
					break;
				case "js":
					info.type = "text/javascript";
					break;
				case "jsx":
					info.type = "text/babel"
					break;
				case "vue":
					info.type = "text/vue"
					break;
				default:
					info.type = "text/plain"
					break;
			}
		}
		return info;
	}

exports.getFiles = getFiles;
exports.createProject = createProject;
