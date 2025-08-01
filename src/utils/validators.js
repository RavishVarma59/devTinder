const validator = require('validator');

function ValidateReqData(req){
    const {firstName, lastName, password, email} = req;
    if(!firstName || !lastName){
        throw new Error("Enter both firstName & lastName");
    } 
    if(firstName.length<4 || firstName.length > 50 ){
        throw new Error("first name character should be between 4-50");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("please enter strong password ${password}");
    } 
    if(!validator.isEmail(email)){
        throw new Error("please enter valid email");
    }
}

module.exports = {
    ValidateReqData
}