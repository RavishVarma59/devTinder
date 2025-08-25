const express = require('express');
const { userAuth } = require('../middleware/auth');
const UserRequest = require('../models/userRequest');
const User = require('../models/user');
const userRouter = express.Router();

const REQ_SENDER_INFO = ['firstName','lastName','age','gender','about','photoUrl','skills'];

userRouter.get('/user/requests/received',userAuth, async (req , res) =>{
        try {
            const loggedInUser = req.user;

            const pendingRequests = await UserRequest.find({
                status: "interested",
                toUserId: loggedInUser._id
            }).populate(
                "fromUserId",
                REQ_SENDER_INFO
            );

            res.json({
                message : "Requests fetch successfully !",
                Data : pendingRequests
            })
        } catch (err) {
            res.status(400).send("Error : ",err.message);
        }
});

userRouter.get('/user/connections', userAuth , async (req , res) => {
    try {
        const loggedInUser = req.user;

        const connections = await UserRequest.find({
            $or : [
                {toUserId : loggedInUser._id , status : 'accepted'},
                {fromUserId : loggedInUser._id , status : 'accepted'}
            ]
        }).populate('fromUserId', REQ_SENDER_INFO )
          .populate('toUserId', REQ_SENDER_INFO );

        const data = connections.map( row => {
            if(row.fromUserId._id.equals(loggedInUser._id)){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({
            message : "connections fetched successfully !",
            Data : data
        })
    } catch (err) {
        res.status(400).json({
            message : "ERROR : "+err.message
        })
    }
});

userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const intractedConnection = await UserRequest.find({
            $or :[{toUserId: loggedInUser._id }, {fromUserId : loggedInUser._id}]
        }).select(['toUserId','fromUserId']);

        let hideUserIds = new Set();
        intractedConnection.forEach( row => {
            hideUserIds.add(row.fromUserId.toString());
            hideUserIds.add(row.toUserId.toString());
        });
        const feedUsers = await User.find({
            $and : [
                { _id : { $nin : Array.from(hideUserIds)}},
                { _id : { $ne : loggedInUser._id}}
            ]
        }).select(REQ_SENDER_INFO);

        res.send({
            data : feedUsers
        })
        
    } catch (err) {
        res.status(400).json({
            message : err.message
        })
    }
})

module.exports = userRouter;