const { Schema, model } = require('mongoose')

const profileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  drivingLicence: Schema.Types.Array,
  documentId: Schema.Types.Array,
  tripHistory: [{
    type: Schema.Types.ObjectId,
    ref: "Trip"
  }],
  hostedTrips: [{
    type: Schema.Types.ObjectId,
    ref: "Trip"
  }],
  address: String,
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