const _ = require('lodash')
const s3 = require('../aws/awsS3Config')
const Profile = require('../model/profileModel')

const profileCltr = {}

profileCltr.addUserProfile = async (req, res) => {
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
      await profile.save()
      res.json(profile)
    } else {
      res.status(400).json({ msg: "Profile already Present" })
    }
  } catch (e) {
    res.status(401).json(e)
  }
}


profileCltr.addHostProfile = async (req, res) => {
  const body = _.pick(req.body, ["address", "city"])
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
      profile.address = body.address
      profile.city = body.city
      profile.drivingLicence = getUrlObj('drivingLicence')
      profile.documentId = getUrlObj('documentId')
      await profile.save()
      res.json(profile)
    } else {
      res.status(400).json({ msg: "Profile already Present" })
    }

  } catch (e) {
    res.status(400).json(e)
  }
}

module.exports = profileCltr