import cookieParser from "cookie-parser";
import express,{ urlencoded} from "express";
import cors from "cors"
import userRoute from "./routes/user.route.js"
import ApiError from "./utils/ApiError.js"
const app = express()

app.use(urlencoded({extended:true})); // encode a data fron a url 
app.use(express.json()) // parsing a data 
app.use(cookieParser());
app.use(cors())


app.use("/api/user",userRoute)



app.use((err,req,res,next)=>{
    return res.status(500).json(new ApiError(500,err.message||"internal server error"))
})

export default app;


