//use packages
require('dotenv').config()
const express=require('express')
const cors = require('cors')
require('./db/connection')
const router=require('./routes/router')
const middleware = require('./middleware/authMiddleware')

const bankServer = express()

bankServer.use(cors())
// json manasilakuna reetiyil request parse cheyyum and this is a middleware 
bankServer.use(express.json())
bankServer.use(middleware.appMiddleware)
bankServer.use(router)

// setup port number to listen server
const port = 3000 || process.env.PORT
 

bankServer.listen(port,()=>{
    console.log(`bank server started at port no : ${port}`);
})

bankServer.get("/",(req,res)=>{
    res.status(200).send(`<h1>Bank server started...</h1>`)
})