// Require the things we will need in the User Route once we define all the functions

const express = require('express')
const sharp = require('sharp')
const router = new express.Router()
const User = require('././user.js')
const auth = require('../middleware/auth.js')
const multer = require('multer')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account.js')



// Creating New User

router.post('/user', async (req, res) => {

   const user = new User(req.body)

   try{

      await user.save()

      sendWelcomeEmail(user.email, user.name)

      const token = await user.generateAuthToken()

      res.status(200).send( {user, token } )

   } catch(e) {

      res.status(400).send(e)

   }

})




//// Sign-In & Out User Routines////


// sign-in
router.post('/users/login', async (req, res) => {
   
   try {
      const user = await User.findByCredentials(
         req.body.email,

         req.body.password
      )
      const token = await user.generateAuthToken()

      res.send( {
         user,

         token,
      })

   } catch ( e ) {

      res.status(400).send({
         error: 'Catch error',
         e,
      });

   }
   
})  


// sign-out
router.post( 'users/logout', auth, async (req, res) => {

   try {

      req.user.tokens = req.user.tokens.filter((token)=> {
         return token.token !== req.token
      });

      await req.user.save()

      res.status(200).send()

   } catch (e) {

      res.status(500).send()

   }
})


// sign-out all
router.post( '/users/logoutAll', auth, async (req, res) => {

   try {

      req.user.tokens = []

      await req.user.save()

      res.status(200).send()

   } catch(e) {

      res.status(500).send()

   }

})





////RUD (Read, Update, Delete) Operations for User Profile////


// Read operation
router.get( '/users/me', auth, async (req, res) => {

   res.send(req.user)

})


// Update validation & operation
router.patch('/users/me', auth, async (req,res) => {

   const updates = Object.keys(req.body)

   const allowUpdates = ['name', 'email', 'password', 'age']

   const isValidOperation = updates.every((update) => {

      allowedUpdates.includes(update)
      
   })

   if(!isValidOperation) {

      return res.status(401).send( {error: 'Updates invalid.'})

   }

   try{

      updates.forEach((update) => ( req.user[update] = req.body[update] ))
      
      await req.user.save()

      res.status(201).send(req.user)

   } catch(e) {

      res.status(404).send( {
         e,
      })

   }

})


// Delate operation
router.delete( '/users/me', auth, async (req,res) => {

   try {

      await req.user.remove()

      sendCancelationEmail(req.user.email, req.user.name)

      res.send()

   } catch(e) {

      res.status(500).send({e: 'Catch Error', e})

   }

})




////Add, Delete, Fetch User Avatar (Profile Picture) (using Multer package for uploads)////

//process & upload avatar
const upload = multer( {

   limits: {

      fileSize: 1000000,

   },

   fileFilter (req,file, cb) {

      if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
         return cb(new Error( 'Image upload must be in jpg, jpeg, or png file format.'))
      }

      cb(undefined, true)

   },

})

// add avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

      const buffer = await sharp(req.file.buffer).resize( {width:180, height:180} ).jpeg().toBuffer()

      req.user.avatar = buffer

      await req.user.save()

      res.send()

   },

   (error, req, res, next) => {

      res.status(400).send({

         error: error.message,

      })

   }

)

// delete avatar
router.delete('/users/me/avatar', auth, async (req, res) => {

   req.user.avatar = undefined

   await req.user.save()

   res.send()

})

// fetch avatar
router.get('/users/:id/avatar', async (req, res) => {

   try{

      const user = await User.findById(req.params.id)

      if(!user || !user.avatar){

         throw new Error()

      }

      res.set('Content-Type', 'image/jpg')

      res.send(user.avatar)

   } catch(e) {

      res.status(404).send()

   }

})

module.exports = router