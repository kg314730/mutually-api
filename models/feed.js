const mongoose = require('mongoose');
const feedSchema = new mongoose.Schema({
    creator:{
        type: String,
        required:true,
    },
    referral_type:{
        type: String,
        required:true,
    },
    company:{
        type: String,
    },
    text:{
        type: String,
    },
    link:{
        type: String,
    },
    picture:{
        type:String,
    },
    name:{
        type: String,
    }
})
module.exports = mongoose.model('Feed',feedSchema);