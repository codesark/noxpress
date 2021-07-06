import session from 'express-session';

declare module 'express-session'{
    export interface SessionData{
        user: { [key: string]: any},
        isAuthenticated: boolean
    }
}

export default session;