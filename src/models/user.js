const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: [4, 'Must be at least 4 characters']
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        lowercase: true, // convert to lowercase before saving
        required : true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Entered !");
            }
        },
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Please Enter Strong password !");
            }
        },
    },
    age: {
        type: Number,
        min: [14, 'Must be at least 14, got {VALUE}']
    },
    gender: {
        type: String,
        validate: {
            validator: function (v) {
                return ['male', 'female', 'other'].includes(v.toLowerCase());
            },
            message: props => `${props.value} is not a valid gender`
        }
    },
    about : {
        type : String,
        default : "default about"
    },
    photoUrl : {
        type : String,
        default : "https://avatar.iran.liara.run/public/boy?username=Ash",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter a valid photo url");
            }
        },
        
    },
    skills: {
        type: [String],
        validate: {
            validator: function (arr) {
                return arr.length <= 10;
            },
            message: props => `Skills array cannot have more than 10 items (got ${props.value.length})`
        }
    }
}, {
    timestamps: true
});



userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({id: user._id}, "DEV@Tinder",{
                expiresIn : '7d'
            });

    return token;
}

userSchema.methods.velidateUserPassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordCorrect = await bcrypt.compare(passwordInputByUser, passwordHash)

    return isPasswordCorrect;
}

const User = mongoose.model("User",userSchema);


module.exports = User;