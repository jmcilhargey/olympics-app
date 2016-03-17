"use strict";

let mongo = require("mongodb");
let client = mongo.MongoClient;
let _db;

module.exports = {

	connect() {
		let uri = "mongodb://jmcilhargey:qualcom1@ds059365.mlab.com:59365/joesdb";
		client.connect(uri, (err, db) => {
			if (err) {
				console.log("Error connecting to Mongo");
				process.exit(1);
			}
			_db = db;
			console.log("Connected to Mongo");
		});
	},
	sports() {
		return _db.collection("sports");
	}
}