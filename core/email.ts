export function sendEmail(from: string, to: string, message: string, htmlMessage?: string): any {
    console.log(`
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n
        Email Sent ------ from: ${from}, to: ${to}\n
        ------------------------------------------------------------\n
        Message:\n 
        ${message}\n
        HTML:\n
        ${htmlMessage}\n
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n
    `)
}