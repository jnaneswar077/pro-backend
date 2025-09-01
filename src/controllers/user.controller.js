// import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
// import { useReducer } from "react";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async(userId) =>
{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken =user.generateRefreshToken()

        // we are storing encoded token into user db
        user.refreshToken = refreshToken

        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // res.status(200).json({
    //     message: "Hello jnaneswar"
    // })

    // get user details form frontend
    // validation - not empty
    // check if user is already registerd: username, email
    // check for images, check for avatar
    // upload them to cloudinary ,avatar
    // create user object - create entry in db
    // remove password and refresh token field form response
    // check for user creation 
    // return res


    const {fullname, email, username, password} = req.body
    console.log("email: ", email);
    console.log("password: ", password);

    // if (fullname === ""){
    //     throw new ApiError(400, "fullname is required")
    // }
        
    if (
        [fullname, email, username, password].some((field) =>
        field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // const existedUser =await User.findOne({
    //     $or: [{ username },{ email } ]
    // })

    console.log("Checking for existing user:", email, username);
    const existedUser = await User.findOne({
    $or: [{ email }, { username }]
    });
    console.log("Found user in DB?", existedUser);
    
    if (existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    


    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }
    console.log("avatar local path: ", avatarLocalPath);
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    // console.log("this is avatar debug", avatar);
    
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }


    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registerd Succesfully")
    )

} )


const loginUser = asyncHandler(async (req, res) => {

    // my steps

    // extract all the info from body
    // check if the user exists already
    // if not exists tell to register
    // if ther user exists validate the password using bcrypt
    // give user a access token and also a refresh token
    // give the time of access token for how long will it be alive
    // after access token expires then generate a new refresh token
    // login successfull


    // chaibhai
    // req body => data
    // username or email 
    // find the user 
    // password check
    // access token and refresh token
    // send cookie

    const {email, username, password} = req.body

    if (!username && !email){
        throw new ApiError(400, "username or password is required")
    }


    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "password incorrect")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //send cookies
    // when we keep secure: true then the cookies is modified only with the help of server and we cannot modify these cookis in the frontend
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser, accessToken, refreshToken
            },
            "user logged In successfully"
        )
    )

})


const logoutUser = asyncHandler( async(req, res) =>{

    await User.findByIdAndUpdate(
    req.user._id,
    {
        $set: {
            refreshToken: undefined
        }
    },
    {
        new: true
    }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res 
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out succesfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "invalid refresh Token")
        }
    
        // since the refresh token with the user db is encoded so that we need to compare it before decoding
        if(incomingRefreshToken != user?.refreshToken){
            throw new ApiError(401, "refresh Token is expired or used")
        }
    
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("AccessToken", accessToken, options)
        .cookie("RefreshToken", newrefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newrefreshToken },
                "Acess token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || 
        "Invalid refresh Token"
        )
    }
    
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}