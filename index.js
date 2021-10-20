const express = require('express');
const mongoose = require("mongoose");
const session  = require ('express-session')
const cors=require("cors")
const redis  = require("redis")
const RedisStore = require("connect-redis")(session)


const {MONGO_USER, MONGO_PASS,MONGO_IP,MONGO_PORT,REDIS_URL,SESSION_SECRET,REDIS_PORT} = require("./config/config")

let redisClient=redis.createClient({
    host:REDIS_URL,
    port:REDIS_PORT
})

const postRouter=require("./routes/postRoutes");
const userRouter= require("./routes/userRoutes")

const app = new express();
app.use(express.json());
app.enable("trust proxy")
app.use(cors({}))
app.use(session({
    store: new RedisStore({client:redisClient}),
    secret:SESSION_SECRET,
    cookie:{
            secure:false,
            resave:false,
            saveUninitialized:false,
            httpOnly:true,
            maxAge:60000
    }

    
}))
const MONGO_URI=`mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connnectwithRetry=()=>{
    mongoose.connect(MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>console.log("successfully cconnected to db"))
    .catch((e)=>{
        console.log(e)
        setTimeout(connnectwithRetry(),5000)
    });

}
connnectwithRetry();

const port=process.env.PORT||3000

app.get("/api/v1/",(req,res)=>{
    res.send("<h2>Hello There !</h2>")
    console.log("yeah i ran")
})
app.use("/api/v1/posts",postRouter);
app.use("/api/v1/users",userRouter);
app.listen(port,()=>console.log(`app is running at port : ${port}`))