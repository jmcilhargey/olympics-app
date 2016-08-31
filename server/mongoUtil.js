"use strict";

let mongo = require("mongodb");
let client = mongo.MongoClient;
let _db;

module.exports = {

	connect() {
		client.connect(process.env.PROD_MONGODB, (err, db) => {
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