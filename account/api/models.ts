import { model, Schema } from "mongoose"

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
    
});

export = model('User', userSchema);

