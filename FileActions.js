const {lstatSync, readdirSync, writeFileSync, readFileSync, appendFileSync, mkdirSync, existsSync} = require("fs");
const {basename, join} = require("path");
const projects = require("./data/projects.json");
class FileActions {
	createProject(projectName){
		var findId = true;
		var id = "";
		while (findId) {
			for (var i = 3; i >= 0; i--) {
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
		writeFileSync(join(__dirname, "data/projects.json"), JSON.stringify(projects));
		mkdirSync(join(__dirname, "projects", id));
	}
	dirTree(filename) {
		var stats = lstatSync(filename),
		    info = {
				path: filename,
				name: basename(filename)
		    };
		if (stats.isDirectory()) {
		    info.type = "folder";
		    info.children = readdirSync(filename).map(function(child) {
		        return dirTree(filename + '/' + child);
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
}
module.exports = FileActions;