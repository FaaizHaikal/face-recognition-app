const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  customerId: String,
  nama: String,
  jenisKelamin: String,
})

const Customer = mongoose.model('customers', customerSchema)

module.exports = Customer
