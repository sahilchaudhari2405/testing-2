const express = require('express');
const expressProxy = require('express-http-proxy');
const cors = require('cors');
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost',
  'http://client:80',
  'http://apalabajar.shop',
  'https://apalabajar.shop',  
  'http://www.apalabajar.shop',
  'https://www.apalabajar.shop',
  'http://localhost:5173',
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

// Use container names for service communication
app.use('/products', expressProxy('http://localhost:3001'));
app.use('/sales', expressProxy('http://localhost:3002'));
app.use('/users', expressProxy('http://localhost:3003'));

app.listen(4000, () => {
  console.log('Gateway server listening on port 4000');
});
