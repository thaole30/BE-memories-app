import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoute from './routes/post.js';
import userRoute from './routes/user.js';


const app = express();
dotenv.config();


app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

const PORT = process.env.PORT || 8000;


//routes
// app.get('http://localhost:8000/posts', (req, res) => {
//     res.json({
//         status: "success"
//     })
// })
app.use('/posts', postRoute); //!every route inside of the postRoutes starts with posts
app.use('/users', userRoute);



mongoose.connect(process.env.CONNECT_URL)
    .then(() => {
        //connect successfully
        app.listen(PORT, () => {
            console.log(`server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("error", error.message);
    })


