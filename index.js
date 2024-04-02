import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import User from "./models/user.js";
import morgan from "morgan";
import { getAllFilters, getUsers } from "./controllers/users.js";
import userRouter from "./routes/user.js";
import env from "dotenv";
env.config();
const app= express();
app.use(morgan("common",{
}));

app.use(cors());       
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const PORT = process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.send("Hello World");
    }
);
app.use("/api",userRouter);

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI,{
    // useNewUrlParse:true,
    // useUnifiedTopology: true
}).then(()=>{
    
    app.listen(PORT,()=>console.log(`Server Port: ${PORT}`));
}).catch((err)=>{
    console.error(err);
});