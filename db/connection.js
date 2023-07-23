const mongoose =require('mongoose')


const connectionString = process.env.DATABASE

mongoose.connect(connectionString,{
    useUnifiedTopology:true,
    useNewUrlParser:true

}).then(()=>{
    console.log("Mongodb Atlas connetecd succesfully...");

}).catch((err)=>{
    console.log(`Mongodb Atlas connetection failed,${err}`);
})