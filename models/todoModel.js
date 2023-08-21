const mongoose = require('mongoose')
const User = require('./User')
const {ObjectId}=mongoose.Schema.Types
const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    brief: {
        type: String,
        required: true
    },
    todoBy:{
        type:ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model('Todo', todoSchema)