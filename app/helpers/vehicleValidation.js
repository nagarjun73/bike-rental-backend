const typeSchema = {
  notEmpty: {
    errorMessage: "Type should not be Empty"
  }
}

const modelSchema = {
  notEmpty: {
    errorMessage: "Model should not be Empty"
  }
}

const vehicleTypeSchema = {
  notEmpty: {
    errorMessage: "Please select vehicle type"
  }
}

const distanceTravelledSchema = {
  notEmpty: {
    errorMessage: "Distance travelled in km required",
    bail: true
  },
  isNumeric: {
    errorMessage: "Field should be in numbers only"
  }
}

const registrationNumberSchema = {
  notEmpty: {
    errorMessage: "Registration number should not be Empty"
  },
}

const manufacturerSchema = {
  notEmpty: {
    errorMessage: "Manufacturer should not Empty"
  }
}

const vehicleImageSchema = {
  custom: {
    options: async (value, { req, res }) => {
      if (!req.files.vehicleImage) {
        throw new Error('Please ensure that filed is not empty.')
      } else if (req.files.vehicleImage.length > 5) {
        throw new Error('You can upload a maximum of three files.')
      } else {
        return true
      }
    }
  }
}

const registrationCertificateSchema = {
  custom: {
    options: async (value, { req, res }) => {
      if (!req.files.registrationCertificate) {
        throw new Error('Please ensure the image is not empty.')
      } else if (req.files.registrationCertificate.length > 2) {
        throw new Error('You can upload a maximum of three files.')
      } else {
        return true
      }
    }
  }
}

const insuranceCerificateSchema = {
  custom: {
    options: async (value, { req, res }) => {
      if (!req.files.insuranceCerificate) {
        throw new Error('Please ensure the image is not empty.')
      } else if (req.files.insuranceCerificate.length > 2) {
        throw new Error('You can upload a maximum of three files.')
      } else {
        return true
      }
    }
  }
}

const emissionCertificateSchema = {
  custom: {
    options: async (value, { req, res }) => {
      if (!req.files.emissionCertificate) {
        throw new Error('Please ensure the image is not empty.')
      } else if (req.files.emissionCertificate.length > 2) {
        throw new Error('You can upload a maximum of three files.')
      } else {
        return true
      }
    }
  }
}

const addVehicleValidationSchema = {
  type: typeSchema,
  model: modelSchema,
  manufacturer: manufacturerSchema,
  vehicleType: vehicleTypeSchema,
  distanceTravelled: distanceTravelledSchema,
  registrationNumber: registrationNumberSchema,
  vehicleImage: vehicleImageSchema,
  registrationCertificate: registrationCertificateSchema,
  insuranceCerificate: insuranceCerificateSchema,
  emissionCertificate: emissionCertificateSchema
}

module.exports = { addVehicleValidationSchema }