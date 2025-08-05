const express = require('express');
const connectDb = require('./config/database');
const User = require('./models/user');
const Bcrypt = require('bcrypt')
const {ValidateReqData} = require('./utils/validators');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middleware/auth')

const app = express();

app.use(express.json());
app.use(cookieParser());
// Ensure indexes are created
User.init().then(() => {
    console.log("Indexes ensured for User schema");
}).catch((err) => {
    console.error("Failed to create indexes:", err.message);
});


// signup user and post that data into data base
app.post('/signup', async (req, res) => {

    const {firstName, lastName, password, email, gender, age} = req.body;

    try {
        //Validate data
        ValidateReqData(req.body);

        //encrypt the data
        const hashPassword = await Bcrypt.hash(password , 10);
        const user = new User({
            firstName,
            lastName,
            password : hashPassword,
            gender,
            age,
            email
        });

        await user.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(400).send("Error while adding user: " + err.message);
    }
});

//login user
app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email : email});
        if(!user){
            throw new Error("invalid Credential");
        }

        const isCorrectPass = await user.velidateUserPassword(password);
        if(!isCorrectPass){
            throw new Error("invalid credential");
        }

        //Generate JWT token
        const token = await user.getJWT();

        res.cookie('TOKEN', token, {
            expires: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)) // cookie will be removed after 8 hours
        });

        res.send("login successfully !");

        
    } catch (error) {
        res.status(400).send("error : " + error.message);
    }
});

app.get('/profile', userAuth, async (req, res) => {
    try {

        const user = req.user;

        res.send(user);
        
    } catch (error) {
        res.status(400).send("error : " + error.message);
    }
})

app.post('/sendConnectionRequest', userAuth, async (req, res) => {
    try {
        const {user} = req;
        res.send(user.firstName + " send the connection request");
    } catch (error) {
        res.status(400).send("error : " + error.message);
    }

})


// connecting to database and start listning request
connectDb().then(()=>{
    console.log("Database connected successfully");
    app.listen(7777,()=>{
        console.log("app is listening on 7777 port number .....");
    });
}).catch(err =>{
    console.error("Database connection failed:", err);
});

