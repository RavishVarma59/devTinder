const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect('mongodb+srv://RavishVarma:sY6plonf215aXDfd@namastenodejs.clfy8do.mongodb.net/devTinder')
}

module.exports = connectDb;