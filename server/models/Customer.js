const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  nik: Number,
  nama: String,
  nomorAntrian: String,
})

const Customer = mongoose.model('customers', customerSchema)

module.exports = Customer
