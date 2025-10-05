const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const { validateUserProfileDataForEdit  } = require('../utils/validators');
const validator = require('validator');
const bcrypt = require ('bcrypt');

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {

        const user = req.user;

        res.send({data : user});
        
    } catch (error) {
        res.status(400).send("error : " + error.message);
    }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        validateUserProfileDataForEdit(req);

        const loginUserProfile = req.user;
        const editProfileData = req.body;

        Object.keys(editProfileData).forEach((key) => {
            loginUserProfile[key] = editProfileData[key];
        });

        await loginUserProfile.save();

        res.json({
            message: `${loginUserProfile.firstName} has updated profile successfully !`,
            user: loginUserProfile
        });

    } catch (error) {
        res.status(400).send("Error : "+ error.message);
    }
} );

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const {oldPassword,newPassword} = req.body;
        //validate old password
        const isCorrectPass = await loggedInUser.velidateUserPassword(oldPassword);
        if(!isCorrectPass){
            throw new Error("invalid credential");
        }
        //check strongness of new password
        if(!validator.isStrongPassword(newPassword)){
            throw new Error(`please enter strong password ${newPassword}`);
        }
        //encrypt new pass & save
         const hashPassword = await bcrypt.hash(newPassword , 10);
         loggedInUser.password = hashPassword;
         await loggedInUser.save();
        
         res.send("password has been updated successfully !");

    } catch (error) {
        res.status(400).send("Password can't updated "+error.message);
    }
    
})

module.exports = profileRouter;