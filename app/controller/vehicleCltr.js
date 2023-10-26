const _ = require('lodash')
const Vehicle = require('../model/vehicleModel')
const s3 = require('../aws/awsS3Config')
const { validationResult } = require('express-validator')



const vehicleCltr = {}

vehicleCltr.addVehicle = async (req, res) => {
  try {
    const errors = validationResult(req)
    console.log(errors)

    const body = _.pick(req.body, ['type', 'model', 'engineCapacity', 'distanceTravelled', 'registrationNumber', ''])//Sanitize
    const { vehicleImage, registrationCertificate, insuranceCerificate, emissionCertificate } = req.files

    //Fuction handles upload file to s3
    async function uploadFileToS3(file) {
      const params = {
        Bucket: 'bikerentals6',
        Key: `${req.user.id}/${file.fieldname}/${Number(new Date())}`,
        Body: file.buffer,
      };
      return s3.upload(params).promise();
    }

    //making nested to flat array
    const arrayFiles = [...vehicleImage, ...registrationCertificate, ...insuranceCerificate, ...emissionCertificate]

    //map over array and call upload function
    const arr2 = await Promise.all(arrayFiles.map((file) => uploadFileToS3(file)))

    //finds specific file based on string
    function getUrlObj(str) {
      return arr2.filter((ele) => ele.Location.includes(str)).map(ele => ({ url: ele.Location, key: ele.Key }))
    }

    const v1 = new Vehicle(body)
    v1.vehicleImage = getUrlObj('vehicleImage')
    v1.registartionCertificate = getUrlObj('registrationCertificate')
    v1.insuranceCerificate = getUrlObj('insuranceCerificate')
    v1.emissionCertificate = getUrlObj('emissionCertificate')
    await v1.save()
    res.json(v1)

  } catch (e) {
    res.json(e)
  }
}

module.exports = vehicleCltr