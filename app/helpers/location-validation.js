const nameSchema = {
  notEmpty: {
    errorMessage: "Field should not be Empty"
  }
}

const locationValidationSchema = {
  name: nameSchema
}

module.exports = { locationValidationSchema }