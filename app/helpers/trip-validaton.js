

const vehicleIdSchema = {
  notEmpty: {
    errorMessage: "vehicle id should not be empty",
    bail: true
  },
  isMongoId: {
    errorMessage: "Invalid mongoId"
  }
}

const hostIdSchema = {
  notEmpty: {
    errorMessage: "Host id should not be empty",
    bail: true
  },
  isMongoId: {
    errorMessage: "Invalid mongoId"
  }
}

const tripStartDateSchema = {
  notEmpty: {
    errorMessage: "Field should not be Empty"
  },
  isISO8601: {
    errorMessage: "Invalid Date and Time.",
    options: { strict: true, strictSeparator: true }
  },
  custom: {
    options: (value) => {
      const currentDay = new Date().toISOString()
      if (value < currentDay) {
        throw new Error("Please choose future date and time.")
      } else {
        return true
      }
    }
  }
}

const tripEndDateSchema = {
  notEmpty: {
    errorMessage: "Field should not be Empty"
  },
  isISO8601: {
    errorMessage: "Invalid Date and Time.",
    options: { strict: true, strictSeparator: true }
  },
  custom: {
    options: (value, { req, res }) => {
      const startDate = req.body.tripStartDate
      const endDate = req.body.tripEndDate
      if (endDate < startDate) {
        throw new Error("Trip end date must be after the start date.")
      } else {
        return true
      }
    }
  }
}

const perDayChargeSchema = {
  notEmpty: {
    errorMessage: "Field should not be Empty",
    isNumeric: {
      errorMessage: "Field should be in number"
    }
  }
}

const tripValidationSchema = {
  vehicleId: vehicleIdSchema,
  hostId: hostIdSchema,
  tripStartDate: tripStartDateSchema,
  tripEndDate: tripEndDateSchema,
  perDayCharge: perDayChargeSchema
}

module.exports = { tripValidationSchema }