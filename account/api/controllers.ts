import express from 'express';

export function signUp (req: express.Request, res: express.Response ): any {
    res.send("Sign UP")
}

export function signIn (req: express.Request, res: express.Response ): any {
    res.send("Sign IN")
}

export function signOut (req: express.Request, res: express.Response ): any {
    res.send("Sign OUT")
}

