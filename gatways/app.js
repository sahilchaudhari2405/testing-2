const express = require('express')
const expressProxy = require('express-http-proxy')

const app = express()


app.use('/products', expressProxy('http://localhost:3001'))
app.use('/sales', expressProxy('http://localhost:3002'))
app.use('/users', expressProxy('http://localhost:3003'))


app.listen(4000, () => {
    console.log('Gateway server listening on port 3000')
})