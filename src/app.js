const express = require('express');
const connectDb = require('./config/database');
const User = require('./models/user');

const app = express();

app.post('/signup', async (req, res) => {
    const user = new User({
        firstName : "Ravish",
        lastName : "Kumar",
        email: "ravish@kumar",
        password: "xyz123"
    });

    try {
        await user.save();
        res.send("User added successfully");
    } catch {(err) => {
        res.send("Error while adding user");
    }};

});



connectDb().then(()=>{
    console.log("Database connected successfully");
    app.listen(7777,()=>{
        console.log("app is listening on 7777 port number .....");
    });
}).catch(err =>{
    console.error("Database connection failed:", err);
});

