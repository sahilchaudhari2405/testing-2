const express = require('express');
const expressProxy = require('express-http-proxy');
const cors = require('cors');
const app = express();
require('dotenv').config()
const test = process.env.CORS_ALLOWED_ORIGINS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost',
  'http://client:80',
  'http://apalabajar.shop',
  'https://apalabajar.shop',  
  'https://apalabajar.shop/', 
  'http://www.apalabajar.shop',
  'https://www.apalabajar.shop',
  'https://www.software.apalabajar.shop',
  'https://software.apalabajar.shop',
  'https://software.apalabajar.shop/',
  'http://localhost:5173',
  'http://65.0.98.146',
  test,
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); 
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json({ limit: '100mb' }));
app.use('/products/import', expressProxy('http://import-export:3001'));
app.use('/products', expressProxy('http://products:3002'));

app.use('/sales/AdvancePay', expressProxy('http://sales-advancepay:4001'));
app.use('/sales/cart', expressProxy('http://sales-cart:4002'));
app.use('/sales/OnGoing', expressProxy('http://sales-ongoing:4003'));
app.use('/sales/order', expressProxy('http://sales-order:4004'));

app.use('/users/admin', expressProxy('http://user-admin:5001'));
app.use('/users/auth', expressProxy('http://user-auth:5002'));
app.use('/users/setting', expressProxy('http://user-setting:5003'));
app.use('/users/users', expressProxy('http://user-users:5004')); // Fixed duplicate issue


// app.use('/products/import', expressProxy('http://localhost:3001'));
// app.use('/products', expressProxy('http://localhost:3002'));

// app.use('/sales/AdvancePay', expressProxy('http://localhost:4001'));
// app.use('/sales/cart', expressProxy('http://localhost:4002'));
// app.use('/sales/OnGoing', expressProxy('http://localhost:4003'));
// app.use('/sales/order', expressProxy('http://localhost:4004'));

// app.use('/users/admin', expressProxy('http://localhost:5001'));
// app.use('/users/auth', expressProxy('http://localhost:5002'));
// app.use('/users/setting', expressProxy('http://localhost:5003'));
// app.use('/users/users', expressProxy('http://localhost:5004')); // Fixed duplicate issue

app.listen(4000, () => {
  console.log('Gateway server listening on port 4000');
});
