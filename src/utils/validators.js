const validator = require('validator');

function ValidateReqData(req){
    const {firstName, lastName, password, email} = req;
    if(!firstName || !lastName){
        throw new Error("Please Enter Both First and Last Name");
    } 
    if(firstName.length<4 || firstName.length > 50 ){
        throw new Error("first name character should be between 4-50");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Enter Strong Password");
    } 
    if(!validator.isEmail(email)){
        throw new Error("Please Enter Valid Email");
    }
}

function validateUserProfileDataForEdit(req){
    const profileEditReq  = req?.body;
    const allowedProfileEdit = ['firstName', 'lastName', 'age', 'gender', 'about', 'skills', 'email','photoUrl'];

    const isAllowedProfileEdit = Object.keys(profileEditReq).every(key => allowedProfileEdit.includes(key));
    
    if(!isAllowedProfileEdit){
        throw new Error("Edit not allowed !");
    }
}

module.exports = {
    ValidateReqData,
    validateUserProfileDataForEdit
}