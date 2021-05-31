import winston from 'winston'
import morgan, { StreamOptions } from 'morgan';

/** 
 *  Winston Configuration
 */

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

const level = () => {
  const env = process.env.NODE_ENV || 'development'
  const isDevelopment = env === 'development'
  return isDevelopment ? 'debug' : 'warn'
}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

winston.addColors(colors)

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
)

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new winston.transports.File({ filename: 'logs/all.log' }),
]

export const Winston = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
})

/**
 *  Morgan Configuration
 */

const stream: StreamOptions = {
    // Use the http severity
    write: (message) => Winston.http(message.trim()),
};

const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
};

export const Morgan = morgan(
    ":method :status :url - :res[content-length] bytes - :response-time ms",
    { stream, skip }
);

const logger = Morgan;
export default logger;
