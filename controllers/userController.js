const users = require('../model/userSchema')
const jwt = require('jsonwebtoken')



// logic to register a data
exports.register = async (req,res)=>{
    console.log("Inside register function");
    // console.log(req);
    
    // get data from req body
    const {username,acno,password}= req.body

    try{
        // check acno in users model
        const result = await users.findOne({acno})
        if(result){
            // if acno exist send responseas already exist
            res.status(406).json("Account already exist. Please log in!!!")
        }
        else{
            // if acno not exists,add to users model
            const newUser = new users({
                username,acno,password,balance:5000,transactions:[]
            })

            // to save changes to mongodb
            await newUser.save()
            // send response as "success"
            res.status(200).json(newUser)
        }

    }catch(err){
        res.status(401).json(err)

    }

}

// login logic


exports.login = async (req,res)=>{
    // get data from request body
    const {acno,password} = req.body
    try{
    
    // chech acno in mongodb
    const bankUser = await users.findOne({acno,password})
    if(bankUser){
        // user already exist - login success
        const token =jwt.sign({loginAcno:acno},"supersecretKey12345")
        res.status(200).json(
            {
            loginUser:bankUser,
            token
        })

    }else{
        res.status(404).json("Invalid account/password")
    }
    }
    catch(err){
        res.status(401).json(err)
    }
}


// get balance logic
exports.getbalance = async(req,res)=>{
    // get acno from request from /get-balance/:acno(parameters)
    // const output = req.params
    const {acno} = req.params
    try{
        // check acno in mongodb
       const response=await users.findOne({acno})
       if(response){
        // acno exist
        res.status(200).json(response.balance)
       }
       else{
        // acno not exist
        res.status(404).json("Account not found")

       }

    }
    catch(err){
        res.status(401).json(err)
    }

    // console.log(output);
    // res.status(200).json("balance request recevied")
}

// fund-transfer

exports.fundtransfer = async(req,res)=>{
    // get  data from request : creditAcno,amount
    console.log("inside fund transfer");
    // debit acno
    const {loginData} = req
    // get data from request : creditAcno,amount
    const {creditAcno,amount} = req.body
    // console.log(loginData);
    let amt = Number(amount)
  try{
    
    // check debit acno in mongodb
    const debitUser = await users.findOne({acno:loginData})
    console.log(debitUser);

    // check credit user details
    const creditUser = await users.findOne({acno:creditAcno})
    console.log(creditUser);

    // if two acccounts are same
    if(loginData==creditAcno){
        res.status(406).json("Operation denied!!!")
    }
    else{
        if(creditUser){
            // sufficient balance for transfer
            if(debitUser.balance>=amt){
    
                debitUser.balance-=amt
                debitUser.transactions.push({
                    transaction_type:"DEBIT",amount:amt,toAcno:creditAcno,fromAcno:loginData
                })
                await debitUser.save()
                creditUser.balance+=amt
                creditUser.transactions.push({
                    transaction_type:"CREDIT",amount:amt,toAcno:creditAcno,fromAcno:loginData
                })
                await creditUser.save()
                res.status(200).json("Transaction successfullt completed. You can perorm next transaction after sometime")
    
            }else{
                res.status(406).json("Transaction failed.... Insuficient Balance!!!")
            }
    
        }
        else{
             res.status(404).json("Invalid credit account details!!!!!")
        }
    }


    
  }
  catch(err){
    res.status(401).json(err)
  }
    

}


exports.gettransactions= async(req,res)=>{
    console.log("Inside transaction function");
    // login acno
    const {loginData} = req
    // get all details of this acno from mongodb
    try{
        const userDetails = await users.findOne({acno:loginData})
        if(userDetails){
            const{transactions} = userDetails
            res.status(200).json(transactions)


        }else{
            res.status(404).json("invalid account details!!")
        }

    }catch(err){
        res.status(401).json(err);

    }

}
exports.deleteAcno = async(req,res)=>{
    console.log("inside delete function");
    // get login data from token
    const {loginData} = req
    try{
       await users.deleteOne({acno:loginData})
       res.status(200).json("Account removed successfull")

    }catch(err){
        res.status(401).json(err);

    }

}

