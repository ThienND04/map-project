const express = require("express");
const morgan = require("morgan")
const helmet = require("helmet");
const cors = require("cors");

const app = express();

app.use(morgan());

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

app.use(cors());

module.exports = app;