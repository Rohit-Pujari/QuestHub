const express = require('express')
const {createProxyMiddleware} = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
const fs = require('fs')


const app = express();

const public_key = fs.readFileSync(process.env.JWT_PUBLIC_KEY,'utf-8')

const authenticateRequest = (req, res,next) =>{
    const authHeader = req.headers['auhtorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token,public_key, (err) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    });
}

app.use(
    '/auth',
    createProxyMiddleware({
        target: process.env.AUTH_SERVICE_URL,
        changeOrigin: true,
    })
)


app.get('/', (req, res) => {
    res.send("API GateWay Running")
})



app.listen(3000, () => console.log('API Gateway listening on port 3000!'))