const _ = require('lodash')
const s3 = require('../aws/awsS3Config')
const Profile = require('../model/profileModel')
const { validationResult } = require('express-validator')

const profileCltr = {}

profileCltr.addUserProfile = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { drivingLicence, documentId } = req.files
  try {
    const arrDocs = [...drivingLicence, ...documentId]
    const foundProfile = await Profile.findOne({ userId: req.user.id })
    if (!foundProfile) {
      //mapping over array documents and uploading to S3 returning promised files
      const promisedFiles = arrDocs.map((file) => {
        const params = {
          Bucket: 'bikerentals6',
          Key: `${req.user.id}-user/documents/${file.fieldname}-${Number(new Date())}`,
          Body: file.buffer,
        };
        return s3.upload(params).promise()
      })

      const arrResolved = await Promise.all(promisedFiles)

      function getUrlObj(str) {
        return arrResolved.filter((ele) => ele.Location.includes(str)).map(ele => ({ url: ele.Location, key: ele.Key }))
      }
      //Create and update profile
      const profile = new Profile()
      profile.userId = req.user.id
      profile.drivingLicence = getUrlObj('drivingLicence')
      profile.documentId = getUrlObj('documentId')
      const prfl = await profile.save()
      res.json({ msg: "Thank you for submitting your documents! We have received them successfully. Please be patient as we verify your documents." })
    } else {
      res.status(400).json({ msg: "Profile already Present" })
    }
  } catch (e) {
    res.status(401).json(e)
  }
}


profileCltr.addHostProfile = async (req, res) => {
  //checking any errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const body = _.pick(req.body, ["city", "street", "area", "state", "pincode"])
  const address = {
    street: body["street"],
    area: body["area"],
    state: body["state"],
    pincode: body["pincode"]

  }
  console.log(body, "Profile")
  const { drivingLicence, documentId } = req.files
  const arrDocs = [...drivingLicence, ...documentId]
  try {
    const foundProfile = await Profile.findOne({ userId: req.user.id })
    if (!foundProfile) {
      //mapping over array documents and uploading to S3 returning promised files
      const promisedFiles = arrDocs.map((file) => {
        const params = {
          Bucket: 'bikerentals6',
          Key: `${req.user.id}-host/documents/${file.fieldname}-${Number(new Date())}`,
          Body: file.buffer,
        };
        return s3.upload(params).promise()
      })

      const arrResolved = await Promise.all(promisedFiles)

      function getUrlObj(str) {
        return arrResolved.filter((ele) => ele.Location.includes(str)).map(ele => ({ url: ele.Location, key: ele.Key }))
      }
      //Create and update profile
      const profile = new Profile()
      profile.userId = req.user.id
      profile.address = address
      profile.city = body.city
      profile.drivingLicence = getUrlObj('drivingLicence')
      profile.documentId = getUrlObj('documentId')
      await profile.save()
      res.json({ msg: "Thank you for submitting your documents! We have received them successfully.Please be patient as we verify your documents." })
    } else {
      res.status(400).json({ msg: "Profile already Present" })
    }

  } catch (e) {
    res.status(400).json(e)
  }
}


profileCltr.unVerifiedList = async (req, res) => {
  try {
    const list = await Profile.find({ isVerified: false })
    res.json(list)
  } catch (e) {
    res.status(400).json(e)
  }
}

profileCltr.approveUnverified = async (req, res) => {
  const id = req.params.id
  console.log(id)
  try {
    const approve = await Profile.findByIdAndUpdate(id, { isVerified: true }, { new: true })
    res.json(approve)
  } catch (e) {
    res.status(400).json(e)
  }
}

profileCltr.profile = async (req, res) => {
  try {
    const role = req.user.role
    const user = req.user
    if (role == "user") {
      const profile = await Profile.findOne({ userId: user.id }).populate({
        path: 'city tripHistory', populate: { path: 'vehicleId hostId', select: "model registrationNumber vehicleImage name" }
      })
      res.json(profile)
    } else if (role == "host") {
      const profile = await Profile.findOne({ userId: user.id })
      res.json(profile)
    } else if (role == "admin") {
      const profile = await Profile.findOne({ userId: user.id })
      res.json(profile)
    }
  } catch (e) {
    res.status(404).json(e)
  }
}

module.exports = profileCltr