const { Schema, model } = require('mongoose')


const vehicleSchema = new Schema({
  type: String,
  model: String,
  make: String,
  engineCapacity: String,
  perDayLimit: String,
  distanceTravelled: Number,
  fuelCapacity: Number,
  registrationNumber: String,
  vehicleImage: String,
  tripHistory: [{
    type: Schema.Types.ObjectId,
    ref: "Trip"
  }],
  availability: boolean,
  registartionCertificate: String,
  insuranceCerificate: String,
  emissionCertificate: String,
  ratings: Number,
  vehicleApproveStatus: String,
})

const Vehicle = model("Vehicle", vehicleSchema)

module.exports = Vehicle