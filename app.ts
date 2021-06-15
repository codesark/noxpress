import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import logger from './core/logger';
import router from './core/router';

const PORT: number = parseInt(process.env.PORT || '3000');
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost/test';
const app: express.Application = express();

async function main() {

    // connect mongoose to database
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true})
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
            mongoUrl: MONGO_URL,
            autoRemove: 'native', // default
        })
    }))
    
    // apply logger and router
    app.use(logger);
    app.use(router);
    
    // start the server
    app.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    })
}

main();