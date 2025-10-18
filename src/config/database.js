const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect('mongodb+srv://RavishVarma:sY6plonf215aXDfd@namastenodejs.clfy8do.mongodb.net/devTinder')

const indexes = await mongoose.connection.db.collection('users').indexes();
console.log(indexes);

}

module.exports = connectDb;