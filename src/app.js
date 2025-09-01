import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static('public'));
app.use(cookieParser());


//routes import
import userRouter from './routes/user.routes.js'

//routes declaration
// app.use("/users", userRouter)

// this is standard practice
app.use("/api/v1/users", userRouter)

//   http://localhost:8000/api/v1//users/register


// let me explain waht happens in line 25 first route goes to api/v1/users and then userRouter will be called then it goes to user.routes.js and there it adds route /register  

export default app;