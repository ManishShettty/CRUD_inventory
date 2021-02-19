const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
	Pid: String,

	product: {
		type: String,
		required: true,
		unique: true,
	},
	quantity: {
		type: Number,
		min: 1,
		max: 100
	},
    price: {
		type: Number,
		min: 10,
		max: 1000
	},
})

module.exports = mongoose.model('Products', ProductSchema)
