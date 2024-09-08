const express = require('express')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 3000
const cors = require('cors')
const {dbConnect} = require('./db.js')

const allowedOrigins=['https://anirand.onrender.com','http://localhost:5173']
const corsOptions={
    origin:function(origin,callback){
        if(allowedOrigins.indexOf(origin)!==-1 || !origin){
            callback(null,true);
        }else{
            callback(new Error("not allowed by CORS"))
        }
    }
}
app.use(cors(corsOptions))

app.use(express.urlencoded({extended:false}))
app.use(express.json())

dbConnect()

const animeModel = require('./Models/AnimeModel')

app.post('/',async (req,res)=>{
    const {data} =req.body
    if(data===null) return res.status(400).json({"Message":"Invalid data."})
    try{
        const anime = await animeModel.create({data})
        res.json({itemId:anime._id})
    }catch(err){
        res.status(500).json({"Message":err.message})
    }
})

app.delete('/:id',async (req,res)=>{
    const {id} = req.params
    if(!id) return res.status(400).json({"Message":"Id is required."})
    try{
        await animeModel.findByIdAndDelete(id)
        res.status(200).json({"Message":"Item has been deleted."})
    }catch(err){
    res.status(500).json({"message":err.message})
    }
})

app.get('/',async (req,res)=>{
    const {page,limit=25} = req.query
    console.log(page)
    try{
        const allData = await animeModel.find().skip((page-1)*limit).limit(limit)
        const hasNextPage = await animeModel.countDocuments() > (page*limit)
        const hasPreviosPage = page!==1
        res.json({
            "data":allData,
            "pagination":{
                hasNextPage,
                hasPreviosPage
            }
        })
    }catch(err){
        res.status(500).json({"message":err.message})
    }
})

app.get('/random',async (req,res)=>{
    try{
        const docCount= await animeModel.countDocuments()
        const randomNum = Math.floor(Math.random()*docCount)
        const randomDocument = await animeModel.find().skip(randomNum).limit(1)
        res.status(200).json({"data":randomDocument[0]})
    }catch(err){
        res.sendStatus(500)
    }
})

app.use('/check/:id',async (req,res)=>{
    const {id} = req.params
    try{
        if(!id) return res.status(401).json({"message":"id is required."})
        const match = await animeModel.find({"data.mal_id":Number(id)})
        if(match.length){
            res.json({
                "id":match[0]._id,
                "isExist":true
            })
            return
        }
        res.json({
            "isExist":false
        })
    }catch(err){
        res.sendStatus(500)
    }
})

app.listen(PORT,()=>{console.log('server is running on port '+PORT)})
