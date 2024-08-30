const mongoose = require('mongoose')

async function dbConnect(){
    try{
        await mongoose.connect(process.env.MONGO_URL,{dbName:'animeList'})
        console.log('database connected')
    }catch(err){
        console.log(err)
    }
}

module.exports={
    dbConnect
}