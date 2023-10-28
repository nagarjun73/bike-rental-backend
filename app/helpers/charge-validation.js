
const nameSchema = {
  notEmpty: {
    errorMessage: "Field should not be empty",
    bail: true
  },
  isLength: {
    options: { max: 50 },
    errorMessage: "The name must be limited to a maximum of 50 characters."
  }
}

const minCcSchema = {
  notEmpty: {
    errorMessage: "Field should not be Empty"
  },
  isNumeric: {
    errorMessage: "Field should be a number"
  }
}

const maxCcSchema = {
  notEmpty: {
    errorMessage: "Field should not be Empty"
  },
  isNumeric: {
    errorMessage: "Field should be a number"
  }
}

const perDayKmLimitSchema = {
  notEmpty: {
    errorMessage: "Field should not be Empty"
  }
}

const perDayChargeSchema = {
  notEmpty: {
    errorMessage: "Field should not be Empty"
  }
}

const addChargeValidationSchema = {
  name: nameSchema,
  minCc: minCcSchema,
  maxCc: maxCcSchema,
  perDayKmLimit: perDayKmLimitSchema,
  perDayCharge: perDayChargeSchema
}

module.exports = { addChargeValidationSchema }

