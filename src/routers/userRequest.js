const express = require('express');
const requestRouter = express.Router();
const User = require('../models/user');
const { userAuth } = require('../middleware/auth');
const UserRequest = require('../models/userRequest');

requestRouter.post('/request/send/:status/:userId', userAuth, async (req, res) => {
    try {
        const status = req.params.status;
        const toUserId = req.params.userId;
        const fromUserId = req.user._id;

        const allowedRequest = ['interested','ignore'];
        if(!allowedRequest.includes(status)){
            throw new Error("Request not allowed !");
        }

        const isUserExist = await User.findById(toUserId);
        if(!isUserExist){
            throw new Error("User does not exist !");
        }

        const isExistingConnectionRequest = await UserRequest.findOne({
            $or : [
                {fromUserId,toUserId},
                {fromUserId: toUserId, toUserId: fromUserId},
            ]
        });
        
        if(isExistingConnectionRequest){
          return  res.status(400).send("Not valid request !");
        }
        
        const userRequest =  new UserRequest({
            toUserId, fromUserId, status
        });

        await userRequest.save()

        res.json({
            message : "user send the request successfull !",
            data : userRequest
        })


    } catch (error) {
        res.status(400).send("error : " + error.message);
    }

});

requestRouter.post('/request/review/:status/:connectionReqUserId', userAuth, async (req, res) => {
    try {
        const {status, connectionReqUserId } = req.params;
        const loggedInUser = req.user;

        const allowedStatus = ['accepted','rejected'];
        if(!allowedStatus.includes(status)){
            return res.status(400).send("status not Allowed !");
        }

        const connectionRequest = await UserRequest.findOne({
            status : 'interested',
            _id : connectionReqUserId,
            toUserId : loggedInUser._id
        });
        if(!connectionRequest){
            throw new Error("Invalid Connection Request")
        }

        connectionRequest.status = status;
        await connectionRequest.save();

        res.json({
            message : `${loggedInUser.firstName} ${status} the request`,
            data : connectionRequest
        })

    } catch (error) {
        res.status(400).json({
            message : "error while updating request ! Error : " + error.message
        });
    }
})

module.exports = requestRouter;
