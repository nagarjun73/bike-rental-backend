const multer = require('multer')
const upload = multer({ limits: { fileSize: 5000000 } })

const multerMiddleware = () => {
  return upload.fields([{ name: 'vehicleImage' }, { name: 'registrationCertificate' }, { name: 'insuranceCerificate' }, { name: 'emissionCertificate' }])
}

module.exports = multerMiddleware