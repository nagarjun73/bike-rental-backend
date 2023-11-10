const multer = require('multer')
const upload = multer()

const multerObj = {}

multerObj.addVehicle = () => {
  return upload.fields([{ name: 'vehicleImage' }, { name: 'registrationCertificate' }, { name: 'insuranceCerificate' }, { name: 'emissionCertificate' }])
}

multerObj.addDocs = () => {
  return upload.fields([{ name: 'drivingLicence' }, { name: 'documentId' }])
}

module.exports = multerObj