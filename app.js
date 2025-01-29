import {express, urlencoded} from "express";

const app = express();

app.use(urlencoded({extended:true})); // encode a data fron a url 
app.use(express.json()) // parsing a data 



