import { model, Schema } from "mongoose"

const userSchema = new Schema({
    username: {
        type: String,
        index: true,
        required: true,
        lowercase: true,
        match: [/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/, 'is invalid']
    },

    emailAddress: {
        type: String,
        index: true,
        required: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },

    phoneNumber: {
        type: String,
        index: true,
        required: true,
    },

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },


});

const otpSchema = new Schema({
    id: {
        type: String
    },
    value: {
        type: String,
        required: true
    }
});

export const User = model('User', userSchema);
export const Otp = model('Otp', otpSchema);

