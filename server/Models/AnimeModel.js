const mongoose = require('mongoose')

const animeSchema = new mongoose.Schema({
    data:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    }
})

const animeModel = mongoose.model('anime',animeSchema)

module.exports=animeModel