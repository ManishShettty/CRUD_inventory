var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var port = 3000

var mongoose = require('mongoose')
var Products = require('./products.model')
app.use(bodyParser.json())

var db = 'mongodb://localhost:27017/assigndata'
mongoose.set('useCreateIndex', true);
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

 
app.get('/products',  (req, res) => {
	Products.find({})
	.exec( (err, result) => {
		if(err) { 
			res.send('An error was encountered')
		} else {
			console.log(result)
			res.json(result)
		}
	})
})
app.get('/products/:Pid', (req, res) => {
	Products.findOne({
		Pid : req.params.Pid
	})
	.exec( (err, products) => {
		if(err) {res.send('Error Encountered')}
		else {res.json(products)}
	})
})

app.post('/add', (req, res) => {
    var newProduct = new Products()
    newProduct.Pid = req.body.Pid
	newProduct.product = req.body.product
	newProduct.quantity = req.body.quantity
	newProduct.price = req.body.price

	newProduct.save( (err, products) => {
		if(err) { res.send('Error while saving a product')}
		else {res.send(products)}
	})
})

app.put('/update/:Pid', (req, res) => {
	mongoose.set('useFindAndModify', false);
	Products.findOneAndUpdate(
		{ Pid : req.params.Pid}, 
		{$set: {product: req.body.product, 
			quantity: req.body.quantity, 
			price: req.body.price}},
		{upsert : true},
		(err, products) => {
			if(err) {res.send('Error in update')}
			else {
				res.send(products)
			}
		}
	)
})


app.delete('/delete/:Pid', (req, res) => {
	Products.findOneAndDelete(
		{ Pid : req.params.Pid },
		(err, products) => {
			if(err) {res.send('Error Encountered')}
			else {res.json('Deleted' + products)}
	} )
} )

app.delete('/products', (req, res) => {
	Products.deleteMany(
		(err, products) => {
			if(err) {res.send('Error in Delete')}
			else {res.send('Deleted all')}
		} )

})

app.listen(port, () => {
	console.log('Server listening on port ' + port)
})
