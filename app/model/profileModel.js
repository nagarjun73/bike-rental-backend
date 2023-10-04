const { Schema, model } = require('mongoose')

const profileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  firstName: String,
  lastName: String,
  mobileNumber: Number,
  address: [{
    type: Schema.Types.ObjectId,
    ref: "Address"
  }],
  city: String,
  profilePictureURL: String,
  drivingLicencePicURL: String,
  adharCardURL: String,
  tripHistory: [{
    type: Schema.Types.ObjectId,
    ref: "Trip"
  }],
  hostedTrips: [{
    type: Schema.Types.ObjectId,
    ref: "Trip"
  }]
})

const Profile = model("Profile", profileSchema)

module.exports = Profile