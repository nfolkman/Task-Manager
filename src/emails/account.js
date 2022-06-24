
const sgMail = require('@sendgrid\\mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {

   sgMail.send({

      to: email,

      From:'nathanielfolkman@gmail.com',

      subject: 'Thanks for joining!',

      text: `Welcome to the team, ${name}. As you begin to utilize the application's features, feel free to reach out in regard to your experience with us!`,

   })

   .then(() => {

      console.log('Success! Email has been sent.')

   })

}

const sendCancelationEmail = (email,name) => {

   sgMail.send({

      to: email,

      from: 'nathanielfolkman@gmail.com',

      subject: 'Sorry to see you go.',

      text: 'If you happen to change your mind down the road, feel free to sign up again!'

   })

   .then(() => {

      console.log('Successfully deleted user email.')

   })

   .catch((error) => {

      console.log('error', error)

   })

}

module.exports = {

   sendWelcomeEmail,

   sendCancelationEmail,

}