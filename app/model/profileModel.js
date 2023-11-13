const { Schema, model } = require('mongoose')

const profileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  drivingLicence: [{
    url: String,
    key: String
  }],
  documentId: [{
    url: String,
    key: String
  }],
  tripHistory: [{
    type: Schema.Types.ObjectId,
    ref: "Trip"
  }],
  hostedTrips: [{
    type: Schema.Types.ObjectId,
    ref: "Trip"
  }],
  address: {
    street: String,
    area: String,
    state: String,
    pincode: Number
  },
  city: {
    type: Schema.Types.ObjectId,
    ref: "Location"
  },
  isVerified: {
    type: Schema.Types.Boolean,
    default: false
  }
}, { timestamps: true })

const Profile = model("Profile", profileSchema)

module.exports = Profile