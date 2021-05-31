import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';

import logger from './core/logger';
import router from './core/router';

const PORT: number = parseInt(process.env.PORT || '3000');
const app: express.Application = express();

app.use(cors());
app.use(helmet())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger);
app.use(router);

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('⚡️[server]: Connected to mongodb.')
    app.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    })
})
.catch((err) => {
    console.log(err);
})