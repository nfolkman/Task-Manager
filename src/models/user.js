// Require what you need

const mongoose = require('mongoose')

const validator = require('validator') // for easy email updating

const bcrypt = require('bcryptjs') // for password encryption

const jwt = require('jsonwebtoken') // for user authentication token

const Task = require('../models/task.js')




// Define Schema with Mongoose

const userSchema = new mongoose.Schema({
   name: {
      type: String,

      required: true,

      trim: true,
   },

   age: {
      type: Number,   
   },

   email: {

      type: String,

      unique: true,

      required: true,

      trim: true,

      lowercase: true,

      validate(value) {
         if (!validator.isEmail(value)) {
            throw new Error('Email is invalid')
         }
      },
   },

   password: {

      type: String,
      
      required: true,

      trim: true,

      validate(value) {
         if(value.length < 6) {
            throw new Error('Password should be more than 6 characters.')
         } else if (value.toLowerCase() == 'password') {
            throw new Error('Given entry cannot be used. Try harder.')
         }
      },
   },

   tokens: [{

      token: {
         type: String,

         required: true,

      },
   },],

   avatar: {

      type: Buffer,
   },

}, {

   timestamps: true,
});





// Link the user to the task model and authenticate user model operation

userSchema.virtual('tasks', {

   ref: 'Task',

   localField: '_id',

   foreignField: 'owner',
})


userSchema.statics.findByCredentials = async(email, password) => {

   const user = await User.findOne({email})

   if(!user) {
      throw new Error('Unable to login, please check login information.')
   }

   return user

}


userSchema.methods.generateAuthToken = async function() {

   const user = this

   const token = jwt.sign({ _id: user._id.toString()}, 
   process.env.JWT_SECRET)

   user.tokens = user.tokens.concat({token})

   await user.save()

   return token
}



// Send back user profile info, excluding select attributes

userSchema.methods.toJSON = function() {

   const user = this


   const userObject = user.toObject()


   delete userObject.passwords

   delete userObject.tokens

   delete userObject.avatar

   
   return userObject
}



// Hash the password before saving (scramble)

userSchema.pre('save', async function(next) {

   const user = this


   if(user.isModified('password')) {

      user.password = await bcrypt.hash(user.password, 8)
   
   }

   next()

})




const User = mongoose.model('User', userSchema)

module.exports = User
