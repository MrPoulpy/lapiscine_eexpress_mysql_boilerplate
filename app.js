const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');

const routes = require('./routes');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(config.basePath, routes);

app.listen(config.port, () => {
    console.log("Server up on port " + config.port);
});