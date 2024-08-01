import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './database/mongo.db.js';
import allRouter from './Router/router.js';
import bodyParser from 'body-parser';

dotenv.config({
  path: './env',
});

const app = express();


const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://apalabajar.shop',
  'https://apalabajar.shop',  
  'http://www.apalabajar.shop',
  'https://www.apalabajar.shop',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow requests with no origin (like mobile apps or curl requests)
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Enable credentials
}));

dotenv.config();
let orderDate = new Date().setDate()+1;

app.use(express.json({ limit: '100mb' })); // Increase limit as needed
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
// Connect to the database
connectDB();

// y
app.use('/api', allRouter);

app.listen(4000, () => {
    console.log('listening on *:4000');
});