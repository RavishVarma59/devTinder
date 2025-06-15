const express = require('express');

const app = express();

// this get request will not be executed when we use /xyz rout with get method
// app.get('/', (req, res,next) => {
//     console.log("Middleware 1");
//     next();
// });

app.use('/',(req, res,next)=>{
    console.log("Middleware 1");
    next();
    // res.send("Hello from Middleware 1");
})

app.get('/user', (req,res,next)=>{
    console.log("Middleware 2");
    next();
}, (req, res) => {
    res.send("User route");
}); 


app.listen(7777,()=>{
    console.log("app is listening on 7777 port number .....");
});