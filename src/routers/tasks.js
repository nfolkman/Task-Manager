//// For creation of task and task route requirements ////


const express = require('express')

const router = new express.Router()

const Task = require('.\\src\\models\\task.js')

const auth = require('.\\src\\middleware\\auth.js')


// Create task //

router.post('/tasks', auth, async(req,res) => {

   const task = new Task({

      ...req.body,

      owner: req.user._id,

   })

   try{

      await task.save()

      res.status(200).send(`Task saved: ${task}`)

   } catch (e) {

      res.status(400).send(e)

   }

})



/// Reading & Requesting tasks and Sorting by creation date ///

router.get('/tasks', auth, async(req,res) => {

   const match = {}

   const sort = {}

   if(req.query.completed) {

      match.completed = req.query.completed === 'true'

   }

   if(req.query.sortBy) {

      const parts = req.query.sortBy.split(':')

      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1

   }

   try{

      await req.user

      .populate({

         path: 'tasks',

         match,

         options: {

            limit: parseInt(req.query.limit),

            skip: parseInt(req.query.skip),

            sort,

         },

      })

      .execPopulate()

      res.send(req.user.tasks)

   } catch (e) {

      res.status(500).send(e)

   }

})



/// Operations using the task ID ///

router.get('/tasks/:id', auth, async(req,res) => {

   const _id = req.params._id

   try{

      const task = await Task.findOne({ _id, owner: req.user._id })

      if(!task) {

         return res.status(401).send(`${error}: Task ID not found.`)

      }

      res.send(task)

   } catch(e) {

      res.status(400).send(e)

   }

})

router.patch('/tasks/:id', auth, async(req,res) => {

   const updates = Object.keys(req.body)

   const allowedUpdates = ['Task', 'completed']

   const isValidOperation = uodates.every((update) => 

   allowedUpdates.includes(update)

   )

   if(!isValidOperation) {

      return res.status(401).send(`${error}: Invalid updates`)

   }

   try{

      const task = await Task.findOne({

         _id: req.params.id,

         owner: req.user._id

      })

      if(!task) {

         res.send(`${error}: Task ID not found to update.`)

      }

      updates,forEach((update) => (task[update] = req.body[update]))

      await task.save()

      res.send(task)

   } catch(e) {

      res.status(400).send(e)

   }

})

router.delete('/tasks/:id', auth, async(req,res) => {

   try{

      const task = await Task.findOneAndDelete({

         _id: req.params.id,

         owner: req.user.id,

      })

      if(!task) {

         res.status404.send(`${error}: Task ID not found.`)

      }

      res.send(task)

   } catch(e) {

      res.status(500).send(`${e}: Catch Error`, e) 

   }

})

module.exports = router