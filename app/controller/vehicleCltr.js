const _ = require('lodash')
const Vehicle = require('../model/vehicleModel')
const { ObjectId } = require('mongodb')
const s3 = require('../aws/awsS3Config')
const { validationResult } = require('express-validator')
const { areIntervalsOverlapping } = require('date-fns')

const vehicleCltr = {}

vehicleCltr.addVehicle = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    } else {

      const body = _.pick(req.body, ['type', 'model', 'vehicleType', 'distanceTravelled', 'registrationNumber',])//Sanitize
      const { vehicleImage, registrationCertificate, insuranceCerificate, emissionCertificate } = req.files
      //Fuction handles upload file to s3
      async function uploadFileToS3(file) {
        const params = {
          Bucket: 'bikerentals6',
          Key: `${req.user.id}/${body.registrationNumber}/${file.fieldname}-${Number(new Date())}`,
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

      //New vehicle
      const v1 = new Vehicle(body)
      v1.hostId = req.user.id
      v1.vehicleImage = getUrlObj('vehicleImage')
      v1.registartionCertificate = getUrlObj('registrationCertificate')
      v1.insuranceCerificate = getUrlObj('insuranceCerificate')
      v1.emissionCertificate = getUrlObj('emissionCertificate')

      await v1.save()
      res.json({ response: v1, msg: "Vehicle added" })
    }
  } catch (e) {
    res.json(e)
  }
}

vehicleCltr.getVehicles = async (req, res) => {
  try {
    const hostVehicles = await Vehicle.find({ hostId: req.user.id }).populate({ path: 'trips', populate: { path: "userId", select: "name" } }).sort({ $natural: -1 })
    res.json(hostVehicles)
  } catch (e) {
    res.json(e)
  }
}

vehicleCltr.changeStatus = async (req, res) => {
  try {
    const vehicleId = req.params.id
    const body = _.pick(req.body, ['availability'])
    const foundVehicle = await Vehicle.findOne({ hostId: req.user.id, _id: vehicleId })
    foundVehicle.availability = body.availability
    await foundVehicle.save()
    res.json(foundVehicle)
  } catch (e) {
    res.json(e)
  }
}

vehicleCltr.list = async (req, res) => {
  try {
    const listVehicles = await Vehicle.find({ vehicleApproveStatus: false }).populate('hostId', ['name', 'city'])
    res.json(listVehicles)
  } catch (e) {
    res.json(e)
  }
}

vehicleCltr.info = async (req, res) => {
  try {
    const id = req.params.id
    const vehicle = await Vehicle.findById(id)
    res.json(vehicle)
  } catch (e) {
    res.json(e)
  }
}

vehicleCltr.approve = async (req, res) => {
  try {
    const id = req.params.id
    const vehicle = await Vehicle.findByIdAndUpdate(id)
    vehicle.vehicleApproveStatus = true
    await vehicle.save()
    res.json(vehicle)
  } catch (e) {
    res.json(e)
  }
}

vehicleCltr.reject = async (req, res) => {
  try {
    const id = req.params.id
    const vehicle = await Vehicle.findByIdAndDelete(id)
    res.json(vehicle)
  } catch (e) {
    res.json(e)
  }
}

vehicleCltr.query = async (req, res) => {
  const body = req.body
  try {

    const vehiclesByCity = await Vehicle.aggregate([{
      $lookup: {
        from: "profiles",
        localField: "hostId",
        foreignField: "userId",
        as: "hostProfile"
      }
    },
    {
      $match: {
        "hostProfile.city": new ObjectId(body.location),
        vehicleApproveStatus: true,
        availability: true
      }
    }
    ])


    const vehicle = await Vehicle.populate(vehiclesByCity, [{ path: 'trips' }, { path: 'vehicleType', select: "perDayCharge" }])


    //loops over every vehicle trips array
    function checkSlot(trips) {
      const overlaps = []
      trips.forEach((ele) => {
        //date-fns method which checks if 2 intervals overlapping
        const overlapping = areIntervalsOverlapping(
          //enquiry 
          { start: new Date(body.tripStartDate), end: new Date(body.tripEndDate) },
          { start: new Date(ele.tripStartDate), end: new Date(ele.tripEndDate) }
        )
        //overlapped element will be pushed to overlaps array
        if (overlapping) {
          overlaps.push(ele)
        }
      })
      return overlaps
    }

    //filter will return empty overlaps element
    const query = vehicle.filter((ele) => {
      console.log(checkSlot(ele.trips).length)
      return !checkSlot(ele.trips).length
    })
    res.json(query)
  } catch (e) {
    res.status(401).json(e)
  }
}

module.exports = vehicleCltr