const express = require('express');
const connectDb = require('./config/database');
const User = require('./models/user');

const app = express();

app.use(express.json());
// Ensure indexes are created
User.init().then(() => {
    console.log("Indexes ensured for User schema");
}).catch((err) => {
    console.error("Failed to create indexes:", err.message);
});


//delete the user 
app.delete('/user',async (req,res) =>{
    const id = req.body.id;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        // await User.deleteOne({
        //     firstName : 'virat'
        // })
        res.send("user deleted successfully");
    } catch (err) {
        res.status(400).send("Error while adding user: " + err.message);
    }
})

//update the user
app.patch('/user/:userId', async (req, res) => {
    const id = req.params.userId;
    const userObj = req.body;
    console.log(id)
    try {
        const ALLOWED_DATA = ['firstName','lastName','gender','age','password','skills'];
        const isUpdateAllowed = Object.keys(userObj).every( k => ALLOWED_DATA.includes(k));

        if(!isUpdateAllowed){
            throw new Error("Can't update Data");
        }
        const updatedUser = await User.findByIdAndUpdate(id,userObj, 
             {
                returnDocument:'before',
                runValidators: true
             });

        console.log(updatedUser)
        res.send("user updated successfully");

    } catch (err) {
        res.status(400).send("Error while adding user: " + err.message);
    }
})
// find user by email id
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
    } catch (err) {
        res.status(400).send("Error while adding user: " + err.message);
    }
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
    } catch (err) {
        res.status(400).send("Error while adding user: " + err.message);
    }
})

// signup user and post that data into data base
app.post('/signup', async (req, res) => {

    // console.log(req.body);
    const userObj = req.body;
    const user = new User(req.body);

    try {
        const ALLOWED_DATA = ['userId','firstName','email','lastName','gender','age','password','skills'];
        const isUpdateAllowed = Object.keys(userObj).every( k => ALLOWED_DATA.includes(k));

        if(!isUpdateAllowed){
            throw new Error("Can't add user");
        }
        await user.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(400).send("Error while adding user: " + err.message);
    }
});


// connecting to database and start listning request
connectDb().then(()=>{
    console.log("Database connected successfully");
    app.listen(7777,()=>{
        console.log("app is listening on 7777 port number .....");
    });
}).catch(err =>{
    console.error("Database connection failed:", err);
});

