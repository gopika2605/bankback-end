
const jwt = require('jsonwebtoken')
exports.appMiddleware =(req,res,next)=>{
    console.log("Inside application specific Middlewares");
    next()
}

exports.jwtMiddleware =(req,res,next)=>{
    console.log("Inside jwtmiddleware");
    // get token from req header postman
    const token = req.headers["access-token"]
    try{
        const {loginAcno} = jwt.verify(token,"supersecretKey12345")
        console.log(loginAcno);
        req.loginData = loginAcno
        next()
    }
    catch{
        res.status(406).json("Please Login")

    }
    
}