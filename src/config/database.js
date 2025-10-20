const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect('mongodb+srv://RavishVarma:faiqFrOHT3oYEDou@namastenodejs.clfy8do.mongodb.net/devTinder');

}

module.exports = connectDb;