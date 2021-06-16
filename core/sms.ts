export function sendSms(phoneNumber: string, message: string): any {
    console.log(`
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n
        SMS Sent ------ Phone / Mobile Number: ${phoneNumber}\n
        ------------------------------------------------------------\n
        Message: 
        ${message}
        ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n
    `); 
}