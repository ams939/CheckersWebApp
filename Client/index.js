"use strict";

const path    = require("path");
const express = require("express");
const app     = express();
const PORT    = 8080;

app.use(express.static(path.join(__dirname, "spa")));


app.listen(PORT, () => console.log("Static files server listening on port " + PORT));