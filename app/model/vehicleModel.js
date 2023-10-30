const { Schema, model } = require('mongoose')


const vehicleSchema = new Schema({
  hostId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  type: String,
  model: String,
  make: String,
  vehicleType: {
    type: Schema.Types.ObjectId,
    ref: "Vehicletype"
  },
  perDayLimit: String,
  distanceTravelled: Number,
  fuelCapacity: Number,
  registrationNumber: String,
  vehicleImage: [{
    url: String,
    key: String
  }],
  trips: [{
    type: Schema.Types.ObjectId,
    ref: "Trip"
  }],
  availability: {
    type: Boolean,
    default: false
  },
  registartionCertificate: [{
    url: String,
    key: String
  }],
  insuranceCerificate: [{
    url: String,
    key: String
  }],
  emissionCertificate: [{
    url: String,
    key: String
  }],
  ratings: {
    type: String,
    default: 'no ratings'
  },
  vehicleApproveStatus: {
    type: Boolean,
    default: false
  }
})

const Vehicle = model("Vehicle", vehicleSchema)

module.exports = Vehicle