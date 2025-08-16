const express = require('express');
const connectDb = require('./config/database');
const cookieParser = require('cookie-parser');

const authRouter = require('./routers/auth');
const profileRouter = require('./routers/profile');
const requestRouter = require('./routers/userRequest');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);

// connecting to database and start listning request
connectDb().then(()=>{
    console.log("Database connected successfully");
    app.listen(7777,()=>{
        console.log("app is listening on 7777 port number .....");
    });
}).catch(err =>{
    console.error("Database connection failed:", err);
});

