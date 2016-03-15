"use strict";

let express = require("express");
let app = express();

app.use(express.static(__dirname + "/../client"));

app.get("/sports", (req, res) => {
	res.json(["Cyling", "Weightlifting"]);
});

app.listen(8080, () => console.log("Listening on port 8080."));


