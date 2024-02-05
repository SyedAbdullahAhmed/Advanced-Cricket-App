const {validate} = require('deep-email-validator')

// email validator function 
// must use async await while using this function
const emailValidator = async (email) => {
  return await validate(email)
}

