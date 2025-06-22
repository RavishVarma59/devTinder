const mongoose = require('mongoose');

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
        trim: true
    },
    password: {
        type: String,
        required: true
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