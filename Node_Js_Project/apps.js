const express = require('express');
const msql = require('./src/database');
const cors = require('cors')
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
})
);
app.use(express.json());
app.use(cookieParser());

const {authRouter} = require('./router/auth');
const profileRouter = require('./router/profile');
const requestRouter = require('./router/request');

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);

msql.connect((err)=>{
    if(err){
        console.error("Connection error");
    }
    
    else{
        console.log("Database Connection established...");
    app.listen(7777,()=>{
        console.log("Server are successfully listening on port 7777......");
    });
    }
});
