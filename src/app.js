const express = require('express');


const app = express();
app.use('/user',(req, res)=> {
    throw new Error ("Error while fetching the user data");
    res.send("user data is fetched successfully");
});
// const {authAdmin , userAdmin}  = require('./middleware/auth');
// app.use('/',(req, res) => {
//     console.log("middleware is running");
//     res.send("middleware is running");
// })
// error handling middleware


// try catch block 
app.use('/test',(req, res,next) => {
    try {
        throw new Error ("error in test rout ");
        res.send("test success");
    } catch (err) {
        console.log ( err.message);
        res.status(501).send("test catch err")
    }
});

app.use('/',(req, res)=>{
    throw new Error("This is a test error");
    
} ,(err, req, res, next) => {
    console.error("Error occurred:", err.message);
    res.status(500).send("something went wrong!");
})
app.listen(7777,()=>{
    console.log("app is listening on 7777 port number .....");
});