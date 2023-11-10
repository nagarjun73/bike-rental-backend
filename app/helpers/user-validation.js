const User = require('../model/userModel')

const nameSchema = {
  notEmpty: {
    errorMessage: "Name should not be empty",
    bail: true
  },
  isLength: {
    options: { max: 50 },
    errorMessage: "The name must be limited to a maximum of 50 characters."
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
}

const mobileNumberSchema = {
  isNumeric: {
    errorMessage: "Enter numbers only",
    bail: true
  },
  isLength: {
    options: { min: 10, max: 10 },
    errorMessage: 'Mobile number should be 10 characters'
  },
}

const passwordSchema = {
  isStrongPassword: {
    options: { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
    errorMessage: "Password must include at least one uppercase, one lowercase, one number, and one symbol."
  }
}

const loginPasswordSchema = {
  notEmpty: {
    errorMessage: "Password should not be empty"
  }
}

const roleSchema = {
  notEmpty: {
    errorMessage: "role should not be empty",
    bail: true
  },
  isIn: {
    options: [['user', 'host']],
    errorMessage: "Invalid role selection"
  }
}

const userSignupValidationSchema = {
  name: nameSchema,
  email: emailSchema,
  mobileNumber: mobileNumberSchema,
  role: roleSchema,
  password: passwordSchema
}

const userLoginValidationSchema = {
  emailOrMobile: emailOrMobileSchema,
  password: loginPasswordSchema
}

module.exports = { userSignupValidationSchema, userLoginValidationSchema }