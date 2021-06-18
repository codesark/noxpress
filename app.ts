import config from './core/config';

import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import logger from './core/logger';
import router from './core/router';

console.log('⚡️[server]: Setting Up...')
if(config.NODE_ENV == 'development') console.log('⚡️[server]: config ', config);

const app: express.Application = express();

async function main() {

    // connect mongoose to database
    await mongoose.connect(config.MONGODB_URL, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useFindAndModify: false, 
        useCreateIndex: true
    })
    console.log('⚡️[server]: Connected to mongodb.')

    // apply middlewares
    app.use(cors());
    app.use(helmet())
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // apply views
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    // apply session
    app.set('trust proxy', 1);
    app.use(session({
        secret: "some secrete phrase",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
        store: MongoStore.create({
            mongoUrl: config.MONGODB_URL,
            autoRemove: 'native', // default
        })
    }))

    // apply logger and router
    app.use(logger);
    app.use(router);

    // start the server
    app.listen(config.PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${config.PORT}`);
    })
}

main();