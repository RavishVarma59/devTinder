const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        unique: true,
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
        default : "about "
    },
    photoUrl : {
        type : String,
        default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb51ZwKCKqU4ZrB9cfaUNclbeRiC-V-KZsfQ&s",
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


const User = mongoose.model("User",userSchema);

module.exports = User;