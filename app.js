const express = require('express');
const morgan = require('morgan');

const router = require('./routes');

const app = express();
const logger = morgan('dev');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use(router);

app.listen(3000);
