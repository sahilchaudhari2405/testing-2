import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './database/mongo.db.js';
import bodyParser from 'body-parser';
import cluster from 'cluster';
import os from 'os';
import importProducts from './controller/importExportProduct.js';
import { authenticateToken } from './middleware/verify.js';

const totalCPUs = os.cpus().length;
dotenv.config({ 
  path: './env',
});
dotenv.config();
connectDB();
const test = process.env.CORS_ALLOWED_ORIGINS;
if(cluster.isPrimary)
{
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
}
else{


const app = express();


const allowedOrigins = [
  'http://localhost:3000',
  'http://client:80',
'http://localhost',
  'http://apalabajar.shop',
  'https://apalabajar.shop',  
  'http://www.apalabajar.shop',
  'https://www.apalabajar.shop',
  'https://www.software.apalabajar.shop',
  'https://software.apalabajar.shop',
  'https://software.apalabajar.shop/',
  'http://65.0.98.146',
  test
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

let orderDate = new Date().setDate()+1;
app.use((req, res, next) => {
  res.setTimeout(5000); // Timeout in milliseconds (5000 ms = 5 seconds)
  next();
});
app.use(express.json({ limit: '100mb' })); // Increase limit as needed
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
// Connect to the database


// y
app.post('/',authenticateToken, importProducts);

app.listen(3001, () => {
    console.log('listening on *:3001');
});
}