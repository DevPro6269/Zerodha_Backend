import {express, urlencoded} from "express";

const app = express();

app.use(urlencoded({extended:true})); // encode a data fron a url 
app.use(express.json()) // parsing a data 



let port = process.env.PORT||8080
app.listen(port,()=>console.log(`app is listening on port : ${port} `))