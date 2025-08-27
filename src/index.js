
// require("dotenv").config({path: "./env"});
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import mongoose, { mongo } from  "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import app from "./app.js";


// in the connectDB function we used async and async returns promise since it is a async function we need to handle this promise usig .then and .catch
connectDB()
.then( () => {
    app.listen(process.env.PORT, () => {
        console.log(`App is running at port ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.error("❌ Error in connecting to DB :", err);
})



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

