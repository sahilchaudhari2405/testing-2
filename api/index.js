import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './database/mongo.db.js';
import allRouter from './Router/router.js';

dotenv.config({
  path: './env',
});

const app = express();
dotenv.config();
let orderDate = new Date().setDate()+1;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Connect to the database
connectDB();

console.log(orderDate)
app.use('/', allRouter);

app.listen(4000, () => {
    console.log('listening on *:4000');
});
