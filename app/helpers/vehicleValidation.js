
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

const engineCapacitySchema = {
  notEmpty: {
    errorMessage: "Engine capacity is required"
  }
}

const distanceTravelledSchema = {
  notEmpty: {
    errorMessage: "Distance travelled in km required",
    bail: true
  },
  isNumeric: {
    errorMessage: "Field should have numbers only"
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
        req.files.vehicleImage.forEach((ele) => {
          if (ele.mimetype.includes('jpeg') || ele.mimetype.includes('pdf' || ele.mimetype.includes('jpg'))) {
            return true
          } else {
            throw new Error(' Invalid File Format. Please upload a file in either PDF or JPEG format')
          }
        })
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
        req.files.registrationCertificate.forEach((ele) => {
          if (ele.mimetype.includes('jpeg') || ele.mimetype.includes('pdf' || ele.mimetype.includes('jpg'))) {
            return true
          } else {
            throw new Error(' Invalid File Format. Please upload a file in either PDF or JPEG format')
          }
        })
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
        req.files.insuranceCerificate.forEach((ele) => {
          if (ele.mimetype.includes('jpeg') || ele.mimetype.includes('pdf' || ele.mimetype.includes('jpg'))) {
            return true
          } else {
            throw new Error(' Invalid File Format. Please upload a file in either PDF or JPEG format')
          }
        })
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
        req.files.emissionCertificate.forEach((ele) => {
          if (ele.mimetype.includes('jpeg') || ele.mimetype.includes('pdf' || ele.mimetype.includes('jpg'))) {
            return true
          } else {
            throw new Error(' Invalid File Format. Please upload a file in either PDF or JPEG format')
          }
        })
      }
    }
  }
}

const addVehicleValidationSchema = {
  type: typeSchema,
  model: modelSchema,
  manufacturer: manufacturerSchema,
  engineCapacity: engineCapacitySchema,
  distanceTravelled: distanceTravelledSchema,
  registrationNumber: registrationNumberSchema,
  vehicleImage: vehicleImageSchema,
  registrationCertificate: registrationCertificateSchema,
  insuranceCerificate: insuranceCerificateSchema,
  emissionCertificate: emissionCertificateSchema
}

module.exports = { addVehicleValidationSchema }