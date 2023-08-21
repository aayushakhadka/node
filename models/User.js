const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
 email:{
 type:String,
 required:[true,'Email is require']
 },

password:{
type:String,
required:true
}

})

module.exports=mongoose.model('User', userSchema)