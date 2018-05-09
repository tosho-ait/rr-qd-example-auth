var mongoose     = require('mongoose')
var Schema       = mongoose.Schema

var CategorySchema = new Schema({
	owner: String,
	ownerId: String,
	label: String,
	subcats: [{
		label: String
	}]
})

module.exports = mongoose.model('Category', CategorySchema)
