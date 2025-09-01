import { log } from "console";
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from "dotenv";

dotenv.config();  // <-- load env first
import path from "path"

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});
// console.log("Cloudinary config:", cloudinary.config());

const uploadOnCloudinary = async (localFilePath) => {

    console.log("inside upload cloudinary");
    
    try {
        if(!localFilePath) return null
        //upload the file on cloudinary

        console.log("ready to upload file");
        // console.log(process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY);
        console.log("File exists?", fs.existsSync(localFilePath));
        const fixedPath = path.resolve(localFilePath);

        console.log("fixed path:", fixedPath)
        const response = await cloudinary.uploader.upload(fixedPath, {
            resource_type: "auto"
        })

        //file has been uploaded succesfully
        console.log("file is uploaded on cloudinary: ", response.url);
        fs.unlinkSync(localFilePath) 
        return response
    } catch (error) {
        console.log("am i inside cloudinary catch: ", error);
        
        fs.unlinkSync(localFilePath) // remove the locally saved temp file as the upload opertion got failed
        return null
    }
}

export {uploadOnCloudinary}
