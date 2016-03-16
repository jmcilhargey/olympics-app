"use strict";

let express = require("express");
let app = express();

let mongoUtil = require("./mongoUtil");
mongoUtil.connect();

app.use(express.static(__dirname + "/../client"));

app.get("/sports", (req, res) => {
	let sports = mongoUtil.sports();
	sports.find({}).toArray((err, docs) => {
		console.log(JSON.stringify(docs));
		let sportNames = docs.map((sport) => sport.name);
		res.json(sportNames);
	});
});

app.get("/sports/:name", (req, res) => {
	let sportName = req.params.name;

	let sports = mongoUtil.sports();
	sports.find({name: sportName}).limit(1).next((err, doc) => {

		if (err) {
			res.sendStatus(400);
		}

		console.log("Sport doc: " + doc);
		res.json(doc);
	});


	
});

app.listen(8080, () => console.log("Listening on port 8080."));


