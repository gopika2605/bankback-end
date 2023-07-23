const mangoose = require('mongoose')
const userSchema = mangoose.Schema({
    username:{
        type:String,
        required:true
    },
    acno:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    balance:{
        type:Number,
        required:true
    },
    transactions:{
        type:Array,
        required:true
    },
})

const users = mangoose.model('users',userSchema)


module.exports=users