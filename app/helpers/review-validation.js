const reviewValidationSchema = {
  vehicleId: {
    notEmpty: {
      errorMessage: "VehicleId is Empty",
      bail: true
    },
    isMongoId: {
      errorMessage: "Invalid vehicleId"
    }
  },
  rating: {
    notEmpty: {
      errorMessage: "rating should not be empty",
      bail: true
    },
    isInt: {
      errorMessage: "The input must be within the range of 0.5 to 5",
      options: { min: 1, max: 5 }
    }
  },
  comment: {
    notEmpty: {
      errorMessage: "comment should not be empty",
      bail: true
    },
    isLength: {
      options: { max: 200 },
      errorMessage: "Not valid rating"
    }
  }
}

module.exports = { reviewValidationSchema }