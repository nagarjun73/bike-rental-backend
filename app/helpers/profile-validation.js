const citySchema = {
  notEmpty: {
    errorMessage: "City is required",
    bail: true
  },
  isMongoId: {
    errorMessage: "city is invalid"
  }
}


const drivingLicenceSchema = {
  custom: {
    options: async (value, { req, res }) => {
      if (!req.files.drivingLicence) {
        throw new Error('Please ensure that filed is not empty.')
      } else if (req.files.drivingLicence.length > 5) {
        throw new Error('You can upload a maximum of three files.')
      } else {
        return true
      }
    }
  }
}

const documentIdSchema = {
  custom: {
    options: async (value, { req, res }) => {
      if (!req.files.documentId) {
        throw new Error('Please ensure that filed is not empty.')
      } else if (req.files.documentId.length > 5) {
        throw new Error('You can upload a maximum of three files.')
      } else {
        return true
      }
    }
  }
}

const streetAreaSchema = {
  notEmpty: {
    errorMessage: "field is required",
    bail: true
  },
  isLength: {
    options: { min: 8, max: 80 },
    errorMessage: "field should be between 5 to 80 characters"
  }
}

const stateSchema = {
  notEmpty: {
    errorMessage: "state is required",
    bail: true
  },
  isLength: {
    options: { max: 30 },
    errorMessage: "state name should be within 30 characters"
  }
}

const pincodeSchema = {
  notEmpty: {
    errorMessage: "pincode is required",
    bail: true
  },
  isLength: {
    options: { max: 6 },
    errorMessage: "pincode should be 6 digits",
    bail: true
  },
  isNumeric: {
    options: { no_symbols: true },
    errorMessage: "pincode should be number"
  }
}


const userProfileValidationSchema = {
  drivingLicence: drivingLicenceSchema,
  documentId: documentIdSchema
}

const hostProfileValidationSchema = {
  drivingLicence: drivingLicenceSchema,
  documentId: documentIdSchema,
  city: citySchema,
  street: streetAreaSchema,
  area: streetAreaSchema,
  state: stateSchema,
  pincode: pincodeSchema
}

module.exports = { userProfileValidationSchema, hostProfileValidationSchema }