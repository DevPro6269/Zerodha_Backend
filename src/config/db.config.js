import mongoose from "mongoose";

async function ConnectDB() {
     console.log(process.env.MONGODB_URL);
    try{
          await mongoose.connect(`${process.env.MONGODB_URL}`)
          console.log("Mongo db is connected");  
    }
    catch (error) {
      console.log(`Error occured :${error}`);
      process.exit(1);
    }
}

export default ConnectDB;