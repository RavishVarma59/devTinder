const express = require('express');
const messagingRouter = express.Router();
const ChatMessages = require('../models/chatMessage')
const { userAuth } = require('../middleware/auth');

// fetch messages between users
messagingRouter.post('/getmessages', userAuth, async (req, res)=> {
    try {
        const { chatWithUserId } = req.body;
        const userId = req.user._id;

        let chat = await ChatMessages.findOne({
            peopleInChats: { $all: [userId, chatWithUserId] }
        }).populate('messages.senderId', 'firstName lastName photoUrl')
        .populate('peopleInChats', 'firstName lastName photoUrl');

        if (!chat) {
            chat = new ChatMessages({
                peopleInChats: [userId, chatWithUserId],
                messages: []
            });

            await chat.save();
            await chat.populate('peopleInChats', 'firstName lastName photoUrl');
        }

        res.status(200).json(chat);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = messagingRouter;