const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Customer = require('../models/Customer')

require("dotenv").config();
const DB_PORT = process.env.DB_PORT || 27017
const DB_NAME = process.env.DB_NAME || 'raisa'

const PORT = process.env.PORT
const HOST = process.env.HOST

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(`mongodb://localhost:${DB_PORT}/${DB_NAME}`)

app.get('/api/get-customer', async (req, res) => {
  try {
    if (!req.query.id) {
      query = {}
    } else {
      query = { customerId: req.query.id }
    }

    const result = await Customer.find(query);
    if (result && result.length > 0) {
      res.status(200)
      res.json(result)
    } else {
      res.status(404)
      res.json({ message: 'Customer not found!' })
    }
  } catch (error) {
    res.status(500)
    res.json({ message: 'Internal server error!' })
  }
})

app.post('/api/add-customer', async (req, res) => {
  try {
    const query = { customerId: req.body.id }
    const customer = {
      nama: req.body.nama,
      nomorAntrian: req.body.nomorAntrian,
    }

    const options = { upsert: true } // Insert if not exist
    const result = await Customer.updateOne(query, customer, options)
    res.json(result);
  } catch (error) {
    console.error(error)
  }
})

app.delete('/api/delete-customer', async (req, res) => {
  try {
    const ids = req.body;
    const result = await Customer.deleteMany({ customerId: { $in: ids } })
    res.json(result)
  } catch (error) {
    console.error(error)
  }
})

app.listen(PORT, HOST, () => {
  try {

    console.log(`Server is running on port ${PORT}`)
  } catch (error) {
    console.error(error)
  }
})
