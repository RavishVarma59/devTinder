const express = require('express');
const { userAuth } = require('../middleware/auth');
const UserRequest = require('../models/userRequest');
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
})

module.exports = userRouter;