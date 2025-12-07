require("dotenv").config();
const express = require('express');
const {createServer} = require('node:http');
const {connectSocket} = require("./utils/socket")
const connectDb = require('./config/database');
const cookieParser = require('cookie-parser');

const authRouter = require('./routers/auth');
const profileRouter = require('./routers/profile');
const requestRouter = require('./routers/userRequest');
const userRouter = require('./routers/user');
const cors = require('cors');

const app = express();

const httpServer = createServer(app);
connectSocket(httpServer);

require("./utils/cronjob");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);

// connecting to database and start listning request
connectDb().then(()=>{
    console.log("Database connected successfully");
    httpServer.listen(7777,()=>{
        console.log("app is listening on 7777 port number .....");
    });
}).catch(err =>{
    console.error("Database connection failed:", err);
});

