const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        index:{unique:true}
    },
    password:{
        type:String,
        required:true,

    },


});
const User = mongoose.model("user",userSchema);

module.exports = User;



