const express = require('express')
const userController = require('../controllers/userController')
const middleware = require('../middleware/authMiddleware')
const router = new express.Router()


// register
router.post("/register",userController.register)
// login
router.post("/login",userController.login)

// get-balance //
// middleware

router.get("/get-balance/:acno",middleware.jwtMiddleware,userController.getbalance)


// fund-transfer
router.post("/fund-transfer",middleware.jwtMiddleware,userController.fundtransfer)


// get transaction
router.get("/get-transaction",middleware.jwtMiddleware,userController.gettransactions)

// delete
router.delete("/delete-my-account",middleware.jwtMiddleware,userController.deleteAcno)



module.exports = router

