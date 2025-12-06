const express = require("express");
const morgan = require("morgan")
const helmet = require("helmet");
const cors = require("cors");
const routes = require("./routes/v1");
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const app = express();

app.use(morgan());

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

app.use(cors());


app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use("/api/v1", routes);

module.exports = app;