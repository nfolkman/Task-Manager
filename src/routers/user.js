// Require the things we will need in the User Route once we define all the functions

const express = require('express')
const sharp = require('sharp')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const { sendWelcomeEmail, sendCancelationEmail } = require('..emails/account')



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



// Sign-In & Out User Routines

