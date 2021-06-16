import dotenv from 'dotenv';

// import the configs from .env file as process.env.VAR_NAME
dotenv.config()

export default {
    NODE_ENV                : process.env.NODE_ENV                          || 'development',
    PORT                    : parseInt(<string>process.env.PORT)            || 3000,
    MONGODB_URL             : process.env.HOST                              || 'mongodb://localhost/test',
    EMAIL_HOST              : process.env.EMAIL_HOST                        || 'localhost',
    EMAIL_PORT              : parseInt(<string>process.env.EMAIL_PORT)      || '1025',
    EMAIL_HOST_USER         : process.env.EMAIL_HOST_USER                   || 'savinay@mymail.com',
    EMAIL_HOST_PASSWORD     : process.env.EMAIL_HOST_PASSWORD               || 'nothing',
    EMAIL_USE_TLS           : (<string>process.env.EMAIL_USE_TLS == 'true') || false,
    SMS_HOST_URL            : process.env.SMS_HOST_URL                      || 'localhost',
    SMS_AUTH_KEY            : process.env.SMS_AUTH_KEY                      || 'somekeyforauth',
    SMS_SENDER_ID           : process.env.SMS_SNEDER_ID                     || 'paisapaisa',
    SMS_ROUTE               : parseInt(<string>process.env.SMS_ROUTE)       || 5,
}