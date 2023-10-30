
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
  },
  isInt: {
    errorMessage: "The input must be within the range of 100 km to 300 km",
    options: { gt: 100, lt: 300 }
  }
}

const perDayChargeSchema = {
  notEmpty: {
    errorMessage: "Field should not be Empty"
  }
}

const perHourChargeSchema = {
  notEmpty: {
    errorMessage: "Field should not be empty"
  }
}

const addChargeValidationSchema = {
  name: nameSchema,
  minCc: minCcSchema,
  maxCc: maxCcSchema,
  perDayKmLimit: perDayKmLimitSchema,
  perDayCharge: perDayChargeSchema,
  perHourCharger: perHourChargeSchema
}

const editChargeValidationSchema = {
  name: nameSchema,
  minCc: minCcSchema,
  maxCc: maxCcSchema,
  perDayKmLimit: perDayKmLimitSchema,
  perDayCharge: perDayChargeSchema,
  perHourCharger: perHourChargeSchema
}

module.exports = { addChargeValidationSchema, editChargeValidationSchema }