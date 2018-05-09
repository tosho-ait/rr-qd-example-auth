var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ExpenseSchema = new Schema({
    date: {
        type: Date,
        required: [true, 'Please select a Date']
    },
    note: {
        type: String,
        maxlength: [50, 'Note must be no more than 50 characters']
    },
    shareNote: {
        type: String
    },
    owner: String,
    ownerId: String,
    image: String,
    loan: Boolean,
    shares: [{
        owner: String,
        ownerId: {
            type: String,
            required: [true, 'Please select a Contact for each Share']
        },
        accepted: Boolean,
        rejected: Boolean,
        amount: Number,
        paid: Number,
        cat: Schema.Types.ObjectId,
        subcat: Schema.Types.ObjectId,
        tmplabel: String
    }]
})

// run validation and return object with error messages
ExpenseSchema.methods.checkValid = function (validation, _error) {
    var expense = this
    if (_error)
        validation._error = _error
    var error = expense.validateSync()
    if (error) {
        for (var key in error.errors) {
            // temporary fix
            validation._error = error.errors[key].message
            validation.hasErrors = true
        }
    }
    return validation
}

module.exports = mongoose.model('Expense', ExpenseSchema)
