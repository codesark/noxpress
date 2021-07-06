import bcrypt from 'bcrypt';

export function msToTime(ms: number): string {
    const d = new Date(1000*Math.round(ms/1000)); // round to nearest second
    // function pad(i: any) { return ('0'+i).slice(-2); } // pad with zero
    const h = d.getUTCHours(), m = d.getUTCMinutes(), s = d.getUTCSeconds();
    const hours   = (h != 0)?  ''+ h +((h > 1)? ' hours'  : ' hour'  ) : '';
    const minutes = (m != 0)? ' '+ m +((m > 1)? ' minutes': ' minute') : '';
    const seconds = (s != 0)? ' '+ s +((s > 1)? ' seconds': ' second') : '';
    const str = hours+minutes+seconds
    return str.trim();
}

export function generateRandomNumber(length: number): string {
    const add = 1;
    let max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   
    if ( length > max ) {
        return generateRandomNumber(max) + generateRandomNumber(length - max);
    }
    max          = Math.pow(10, length+add);
    const min    = max/10; // Math.pow(10, n) basically
    const number = Math.floor( Math.random() * (max - min + 1) ) + min;
    return ("" + number).substring(add); 
}

export function hashPassword(password: string): string {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return hashedPassword;
}

export function comparePassword(plainPassword: string, hash: string): boolean {
    return bcrypt.compareSync(plainPassword, hash);
}