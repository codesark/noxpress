import { model, Schema, Document } from "mongoose";
import config from '../../core/config';

function setExpireAtTime(): Date {
    const d1 = new Date();
    const d2 = new Date(d1)
    d2.setMilliseconds(d1.getMilliseconds() + config.OTP_EXPIRE)
    return d2
}

export interface UserDoc extends Document {
    username: string,
    emailAddress: string,
    phoneNumber: string,
    password: string,
    firstName: string,
    lastName: string,
    gender: string,
    dateOfBirth: Date,
    isActive: boolean,
    isStaff: boolean,
    isAdmin: boolean,
    groups: [string],
    permission: [string],
}

const userSchema = new Schema<UserDoc>({

    username: {
        type: String,
        index: true,
        required: true,
        match: [/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/, 'is invalid']
    },

    emailAddress: {
        type: String,
        index: true,
        lowercase: true,
    },

    phoneNumber: {
        type: String,
        index: true,
    },

    password: {
        type: String
    },

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    gender: {
        type: String
    },

    dateOfBirth: {
        type: Date
    },

    isActive: {
        type: Boolean,
        default: true
    },

    isStaff: {
        type: Boolean,
        default: false
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    groups: {
        type: [String]
    },

    permissions: {
        type: [String]
    }

}, { timestamps: true });

export interface OtpDoc extends Document {
    emailAddress: string,
    phoneNumber: string,
    value: string,
    purpose: string,
    expireAt: Date,
    isExpired: boolean,
}

const otpSchema = new Schema<OtpDoc>({
    emailAddress: {
        type: String,
        index: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        index: true
    },
    value: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },

    expireAt: {
        type: Date,
        default: setExpireAtTime,
    }
}, { timestamps: true });

otpSchema.virtual('isExpired').get(function (this: any) {
    const date = new Date();
    if (date > this.expireAt) return true;
    return false;
});

export const User = model<UserDoc>('User', userSchema);
export const Otp = model<OtpDoc>('Otp', otpSchema);

