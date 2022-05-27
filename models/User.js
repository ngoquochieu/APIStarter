const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    fullname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        verify: {
            type: Date,
            default: null
        }
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
    },  
    password: {
        type: String,
    },
    authGoogleID: {
        type:String,
        default:null
    },
    authFacebookID: {
        type:String,
        default:null
    },
    authType: {
        type:String,
        enum: ['local', 'google', 'facebook'],
        default:'local'
    },
    cart: [{
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    }]
})

UserSchema.pre('save', async function (next) {
    try {
        if(this.authType !== 'local') next();
        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Generate a password hash (salt + hash)
        const passwordHashed = await bcrypt.hash(this.password, salt);

        // Re-assign password hashed
        this.password = passwordHashed;
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.isValidPassword = async function(newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
}

const User = mongoose.model('User', UserSchema)
module.exports = User