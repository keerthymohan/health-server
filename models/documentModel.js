const mongoose = require('mongoose')
const documentSchema = new mongoose.Schema({
    title:{
        required : true,
        type : String
    },
    docimage:{
        required : true,
        type : String
    }
})
const documents = mongoose.model("documents",documentSchema)
module.exports = documents