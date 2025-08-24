const mongoose = require('mongoose');


const userRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref : "User"
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref : "User"
  },
  status: {
    type: String,
    required : true,
    enum: {
      values: ['accepted', 'rejected', 'interested', 'ignore'], // Allowed statuses
      message: '{VALUE} is not a valid status.' // Custom error message
    }
  },

}, {
  timestamps: true
});

userRequestSchema.pre("save", async function(next) {
      const user = this;
      if(user.fromUserId.equals(user.toUserId)){
        throw new Error("Can't send Request to self !");
      }
      next();
});

userRequestSchema.index({fromUserId : 1, toUserId : 1});


const UserRequest = mongoose.model("UserRequest",userRequestSchema);


module.exports = UserRequest;