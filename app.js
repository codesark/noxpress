const express = require('express');
const morgan = require('morgan');

const router = require('./routes');

const app = express();
const logger = morgan('dev'); // sets morgan logger mode: dev, combined

app.set('view engine', 'ejs'); // sets view engine to EJS
app.set('views', 'views'); // sets view folder location

app.use(logger);
app.use(express.json()); // use express json bodyparser
app.use(express.urlencoded({
  extended: true,
})); // use express urlencoded body parser

app.use(router);

app.listen(3000);
