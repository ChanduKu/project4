const mongoose=require('mongoose')
 const urlModle = new mongoose.Schema({
    urlCode:{type:String,required:true,unique:true,lowercase:true,trim:true },
    longUrl:{type:String,required:true,unique:true,trim:true},  
    shortUrl:{type:String,required:true,unique:true}  
})
module.exports=mongoose.model('urlModle',urlModle)
