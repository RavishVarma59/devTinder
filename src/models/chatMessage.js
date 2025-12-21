const mongoose = require('mongoose');
const User = require('./user')

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    }
})

const chatMessageSchema = new mongoose.Schema({
    peopleInChats: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true
    },
    messages: [messageSchema]
},{
    timestamps: true
});

const ChatMessages = mongoose.model('ChatMessages', chatMessageSchema);

module.exports = ChatMessages;