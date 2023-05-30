const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
    question:{
        type:String,
        required:true,
    },
    answer:String
},
{
    timestamps:true
});

module.exports = mongoose.model('User',chatSchema);
