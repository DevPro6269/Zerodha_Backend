import dotenv from 'dotenv';
dotenv.config();
import ConnectDB from './src/config/db.config.js'




let port = process.env.PORT||8080
app.listen(port,()=>console.log(`app is listening on port : ${port} `))
ConnectDB()