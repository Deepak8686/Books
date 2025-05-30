import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import router from './routes/routes.js';
dotenv.config();
const app = express();

app.use(express.json())
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors({
    origin: ["http://localhost:3000"],
}));

const PORT = process.env.PORT || 7000;

app.use('/api', router);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`connected to db, listening on port ${PORT}`);
        });
    }).catch((error) => {
        console.log(error.message);
    });