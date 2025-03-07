import dotenv from 'dotenv';
dotenv.config();
import ConnectDB from './config/db.config.js'
import  app  from './app.js';
let port = process.env.PORT||8080


ConnectDB().then(()=>{
    app.listen(port,()=>console.log(`app is listening on port : ${port} `))
})
.catch((err)=>{
    console.log("mongo db connection failed",err);
})