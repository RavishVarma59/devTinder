const express = require('express');
const requestRouter = express.Router();
const User = require('../models/user');
const { userAuth } = require('../middleware/auth')

requestRouter.post('/sendConnectionRequest', userAuth, async (req, res) => {
    try {
        const {user} = req;
        res.send(user.firstName + " send the connection request");
    } catch (error) {
        res.status(400).send("error : " + error.message);
    }

});

module.exports = requestRouter;
