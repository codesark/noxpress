// import express from 'express';
// import * as http from 'http';

// import * as winston from 'winston';
// import * as expressWinston from 'express-winston';
// import cors from 'cors';
// import {CommonRoutesConfig} from './common/common.routes.config'
// import {UsersRoutes} from './users/users.routes.config';
// import debug from 'debug';

// const app: express.Application = express()
// const server: http.Server = http.createServer(app);
// const port = 3000;
// const routes: Array<CommonRoutesConfig> = [];
// const debugLog: debug.IDebugger = debug('app');

// app.use(express.json());

// app.use(cors());

// const loggerOptions: expressWinston.LoggerOptions = {
//     transports: [ new winston.transports.Console()],
//     format: winston.format.combine(
//         winston.format.json(),
//         winston.format.prettyPrint(),
//         winston.format.colorize({all: true})
//     ),
// };

// if(!process.env.DEBUG) {
//     loggerOptions.meta = false;  // when not debugging, log requests as one-liners
// }

// app.use(expressWinston.logger(loggerOptions));

// routes.push(new UsersRoutes(app));

// const runningMessage = `Server running as http://localhost:${port}`;

// app.get('/', (req: express.Request, res: express.Response) => {
//     res.status(200).send(runningMessage);
// })

// server.listen(port, () => {
//     routes.forEach((route: CommonRoutesConfig) => {
//         debugLog(`Routes configured for ${route.getName()}`);
//     })

//     console.log(runningMessage);
// })


import express from 'express';


const app = express();

const PORT = 3000

app.get('/', (req, res) => res.send('Express + Typescript Server'));

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
})