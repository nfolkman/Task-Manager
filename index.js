// Require the packages we will need in the app

const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require ('./routers/tasks')
const mongooserequiring = require('./db/mongoose')



// Define app as express application and define port (including defining PORT number in our config file for security and reliability)

const app = express()
const port = process.env.port


// Set up paths for middleware layers of application

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


// Confirm the application launch with log

app.listen(port, ()=> {
   console.log(`Server is at port ${port}`)
})