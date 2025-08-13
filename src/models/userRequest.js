const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  senderUserId : {
        type: Number | String,
        required: true
  },
  recUserId : {
    type : Number | String,
    required : true
  },
  status : {
    type : String,
    
  },
  
}, {
    timestamps: true
});