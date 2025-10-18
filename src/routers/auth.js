const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const Bcrypt = require('bcrypt')
const {ValidateReqData} = require('../utils/validators');

// signup user and post that data into data base
authRouter.post('/signup', async (req, res) => {

    const {firstName, lastName, password, email, gender, age} = req.body;

    try {
        //Validate data
        ValidateReqData(req.body);

        //encrypt the data
        const hashPassword = await Bcrypt.hash(password , 10);
        const user = new User({
            firstName,
            lastName,
            password : hashPassword,
            gender,
            age,
            email
        });

        const signUpUser = await user.save();
        //Generate JWT token
        const token = await signUpUser.getJWT();

        res.cookie('TOKEN', token, {
            expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)) // cookie will be removed after 8 hours
        });
        res.send({
            message : "User added successfully",
            data : user
        });
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

//login user
authRouter.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email : email});
        if(!user){
            throw new Error("invalid Credential");
        }

        const isCorrectPass = await user.velidateUserPassword(password);
        if(!isCorrectPass){
            throw new Error("invalid credential");
        }

        //Generate JWT token
        const token = await user.getJWT();

        res.cookie('TOKEN', token, {
            expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)) // cookie will be removed after 8 hours
        });

        res.send({data : user});

        
    } catch (error) {
        res.status(400).send("Error : " + error.message);
    }
});

//logout 
authRouter.post('/logout', async (req, res) => {
        res.cookie('TOKEN', null, {
            maxAge: 0 // cookie will be removed after 8 hours
        });

        res.send({data : "logOut successfully !"});
});
module.exports = authRouter;