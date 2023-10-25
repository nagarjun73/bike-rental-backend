const User = require('../model/userModel')

const nameSchema = {
  notEmpty: {
    errorMessage: "Name should not be empty"
  }
}

const emailOrMobileSchema = {
  notEmpty: {
    errorMessage: "Field should not be Empty"
  }
}

const emailSchema = {
  isEmail: {
    errorMessage: "Email is Invalid"
  },
  // custom: {
  //   options: async (value) => {
  //     const user = await User.findOne({ email: value })
  //     if (user) {
  //       throw new Error('Email is already in use.')
  //     } else {
  //       return true
  //     }
  //   }
  // }
}

const mobileNumberSchema = {
  isNumeric: {
    errorMessage: "Enter numbers only"
  },
  isLength: {
    options: { min: 10, max: 10 },
    errorMessage: 'Mobile number should be 10 characters'
  },
  // custom: {
  //   options: async (value) => {
  //     const user = await User.findOne({ mobileNumber: value })
  //     if (user) {
  //       throw new Error('Mobile number is already in use')
  //     } else {
  //       return true
  //     }
  //   }
  // }
}

const passwordSchema = {
  isStrongPassword: {
    options: { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
    errorMessage: "Password must include at least one uppercase, one lowercase, one number, and one symbol."
  }
}

const userSignupValidationSchema = {
  name: nameSchema,
  email: emailSchema,
  mobileNumber: mobileNumberSchema,
  password: passwordSchema
}

const userLoginValidationSchema = {
  emailOrMobile: emailOrMobileSchema,
  password: passwordSchema
}

module.exports = { userSignupValidationSchema, userLoginValidationSchema }