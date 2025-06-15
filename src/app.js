const express = require('express');

const app = express();

// app.use('Route', [RH , RH2], RH3, RH4);

app.use('/user',
[(req,res,next)=>
    {
    console.log("middleware is running");
    next();
}, (req, res,next) => {
    console.log("this is the first middleware");
    next();
}], (req, res,next) => {
    console.log("this is the second middleware");
    next();
}, (req, res,next) => {
    console.log("this is the third middleware");
    next();
}, (req, res) => {
    console.log("this is the fourth middleware");
    res.send("this is the 4th middleware response");
});


app.listen(7777,()=>{
    console.log("app is listening on 7777 port number .....");
});