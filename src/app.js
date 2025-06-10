const express = require('express');

const app = express();

app.use('/test',(req,res)=>{
    res.send("test is running !");
});

app.use('/hello',(req,res)=>{
    res.send("hellow from hello path !");
});

app.use('/',(req,res)=>{
    res.send("welcome to the dashboard !");
});


app.listen(7777,()=>{
    console.log("app is listening on 7777 port number .....");
});