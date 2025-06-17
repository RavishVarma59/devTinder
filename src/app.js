const express = require('express');
const connectDb = require('./config/database');
const User = require('./models/user');

const app = express();

app.use(express.json());

app.get('/user',async (req,res) => {
    const userId = req.body.email

    try {
        const user = await User.findOne({
            email : userId
        })
        if(user) {
            res.send(user);
        } else {
            res.status(404).send("user not found");
        }
    } catch {(err) => {
        res.status(400).send("something went wrong");
    }}
});

// get all user to feed the data to signup user
app.get('/feed', async (req,res) => {
    try{
        const users = await User.find({});
        if(users) {
            res.send(users);
        } else {
            res.status(404).send("user not found");
        }
    } catch {(err) => {
        res.status(400).send("something went wrong");
    }}
})

app.post('/signup', async (req, res) => {

    // console.log(req.body);
    const user = new User(req.body);

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

