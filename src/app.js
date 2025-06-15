const express = require('express');


const app = express();
const {authAdmin , userAdmin}  = require('./middleware/auth');

app.use('/admin', authAdmin );

app.get('/admin/getData', (req, res) => {
    res.send("Admin data fetched successfully");    
});

app.delete('/admin/deleteData', (req, res) => {
    res.send("Admin data deleted successfully");
});

// user auth middleware in same line of request handler 
app.get ('/user/getData', userAdmin, (req, res ) => {
    res.send("User data fetched successfully");
})

// user auth will not required when user login
app.post('/user/login', (req, res) => {
    res.send("User login successfully");
});

app.listen(7777,()=>{
    console.log("app is listening on 7777 port number .....");
});