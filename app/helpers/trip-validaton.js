
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
    errorMessage: "Field should not be Empty",
    bail: true
  },
  isISO8601: {
    errorMessage: "Invalid Date and Time.",
    bail: true
  },
  custom: {
    //Check if trip start date is more then current time
    options: (value) => {
      const currentDay = new Date()
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
    errorMessage: "Field should not be Empty",
    bail: true
  },
  //check if input date time valid ISO8601 fromate
  isISO8601: {
    errorMessage: "Invalid Date and Time.",
    bail: true
  },
  custom: {
    //check if trip end date is more then trip start date
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

const tripValidationSchema = {
  vehicleId: vehicleIdSchema,
  hostId: hostIdSchema,
  tripStartDate: tripStartDateSchema,
  tripEndDate: tripEndDateSchema,
}

module.exports = { tripValidationSchema }