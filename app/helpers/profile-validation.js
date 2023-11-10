
const addressSchema = {
  notEmpty: {
    errorMessage: "Address is required",
    bail: true
  },
  isLength: {
    errorMessage: "Address must be minimum 25 characters",
    options: { min: 25 }
  }
}

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

const userProfileValidationSchema = {
  drivingLicence: drivingLicenceSchema,
  documentId: documentIdSchema
}

const hostProfileValidationSchema = {
  drivingLicence: drivingLicenceSchema,
  documentId: documentIdSchema,
  address: addressSchema,
  city: citySchema
}

module.exports = { userProfileValidationSchema, hostProfileValidationSchema }