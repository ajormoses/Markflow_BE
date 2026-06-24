import express from "express";
import cookieSession from "cookie-session";
import cors from 'cors'
import { errorHandler, currentUserMiddleware } from "./src/middleware/index.js";
import userRouter from './src/routes/user.routes.js'
import bookmarkRouter from "./src/routes/bookmark.routes.js"
import categoryRouter from "./src/routes/category.routes.js"


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

app.use(currentUserMiddleware);


app.use(userRouter);
app.use(bookmarkRouter);
app.use(categoryRouter);

app.use(errorHandler);



export default app;