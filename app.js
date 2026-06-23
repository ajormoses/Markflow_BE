import express from "express";
import cookieSession from "cookie-session";
import cors from 'cors'
import { errorHandler } from "./src/middleware/errorhandler.js";


const app = express();

app.use(cors(
    {
        origin: '*',
        optionsSuccessStatus: 200
    }
))
app.set('trust proxy', 1) // trust first proxy

app.use(express.json());
app.use(cookieSession({
    signed: false,
    secure: false,
}))



app.use(errorHandler);



export default app;