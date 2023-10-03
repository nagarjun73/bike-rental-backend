const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    mongoose.connect(`mongodb:127.0.0.1:27017/bike-rental-app`)
    console.log("Connected to mongodb")
  } catch (e) {
    console.log("Error connecting to mongodb")
  }
}

module.exports = connectDB