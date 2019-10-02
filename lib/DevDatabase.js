const {join} = require("path");
const {existsSync, mkdirSync, writeFile} = require("fs");

class DevDatabase {
	constructor() {
		this.path = join(__dirname, "..", "data");
	}
	init() {
		const _this = this;
		const tables = ["projects", "files"];
		return new Promise((resolve, reject) => {
			if (!existsSync(_this.path)) {
				mkdirSync(_this.path);
			}

			for (let i = 0; i < tables.lenght; i++) {
				const table = tables[i];
				if (existsSync(join(_this.path, `${table}.json`))) {
					reject(`Table "${table}"" already exists`);
					break;
				}
				else {
					_this.createTable(table);
				}
			}
			resolve("done");
		});
	}
	createTable(tableName) {
		return new Promise((resolve, reject) => {
			writeFile(join(this.path, `${tableName}.json`), "[]", (err) => {
				if (err) reject("Error on Save");
				else resolve();
			});
		});
	}
	push(tableName, data) {
		return new Promise((resolve, reject) => {
			const path = join(this.path, `${tableName}.json`);
			if (!existsSync(path))
				reject(`Table ${tableName} does not exists`);
			else {
				var table = require(path);

				table.push(data);

				writeFile(path, JSON.stringify(table), (err) => {
					if (err) reject("Error on Save");
					else resolve();
				})
			}
		});
	}
	fetch(tableName, fields) {
		return new Promise((resolve, reject) => {
			const path = join(this.path, `${tableName}.json`);
			if (!existsSync(path))
				reject(`Table ${tableName} does not exists`);
			else {
				var table = require(path);

				table = table.map(e => {
					if (fields) {
						var field = {};
						fields.forEach(a => {
							field[a] = e[a];
						});

						return field;
					}

					return e;
				});

				resolve(table);
			}
		});
	}
	update(tableName, fieldID, values) {
		return new Promise((resolve, reject) => {
			const path = join(this.path, `${tableName}.json`);
			if (!existsSync(path))
				reject(`Table ${tableName} does not exists`);

			else {
				var table = require(path);
				var field = table[fieldID];

				const val = Object.entries(values).forEach(e => {
					field[e[0]] = e[1];
				});

				writeFile(path, JSON.stringify(table), (err) => {
					if (err) reject("Error on Save");
					else resolve();
				});
			}
		})

	}
}
module.exports = DevDatabase;
