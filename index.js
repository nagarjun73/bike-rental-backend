require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/mongodb')
const port = process.env.PORT

const app = express()

connectDB()

app.use(express.json())
app.use(cors())

app.listen(port, () => {
  console.log("server running on port", port)
})