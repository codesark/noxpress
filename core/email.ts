import config from "./config";

export function sendEmail(to: string, message: string, htmlMessage?: string): any {
    console.log(`
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n
        Email Sent ------ from: ${config.EMAIL_HOST_USER}, to: ${to}\n
        ------------------------------------------------------------\n
        Message:\n 
        ${message}\n
        HTML:\n
        ${htmlMessage}\n
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n
    `)
}