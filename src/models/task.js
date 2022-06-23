const mongoose = require('mongoose')

const taskSchema = new mongoose.schema({

   Task: {

      type: String,

      required: true,
   },

   completed: {

      type: Boolean,

      default: false,

   },

   owner: {

      type: mongoose.Schema.Types.ObjectId,

      required: true,

      ref: 'User',

   },

   }, {

   timeStamps: true,

})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task



