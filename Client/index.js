"use strict";

const express = require("express");
const app     = express();
const PORT    = 8080;

app.use(express.static(__dirname));

app.get("/", (req, res) =>
{
	// Set up "matchmaking" to be the landing page.  Matchmaking.js contains
	// functionality to redirect the users to the login page if they do not
	// have a username set.
	res.redirect("/matchmaking");
});

app.listen(PORT, () => console.log("Static files server listening on port " + PORT));