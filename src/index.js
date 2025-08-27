
// require("dotenv").config({path: "./env"});
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import mongoose, { mongo } from  "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";


connectDB();


/*

import express from "express";
const app = express();
;( async ()=>{
    try{
        // mongoose.connect(process.env.MONGO_URI); this also works
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        app.on("error", (error)=> {
            console.log("Error in connecting to DB :", error);
            throw error
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`App is running at port ${process.env.PORT}`);
        })
    } catch(error){
        console.log("Error: ", error);
        throw error;
    }
})()

*/

