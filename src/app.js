const express = require('express');
const connectDb = require('./config/database');
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const { userAuth } = require('./middleware/auth')

const authRouter = require('./routers/auth');

const app = express();

app.use(express.json());
app.use(cookieParser());
// Ensure indexes are created
User.init().then(() => {
    console.log("Indexes ensured for User schema");
}).catch((err) => {
    console.error("Failed to create indexes:", err.message);
});

app.use('/',authRouter);


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

