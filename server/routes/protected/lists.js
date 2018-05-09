var config = require('../../../config')

module.exports = function (app, express) {
    var listsRouter = express.Router()
    listsRouter.post('/get', function (req, res) {
        var listName = req.body.listName

        if (listName == 'cats') {
            var cats = req.mycats.map(cat=> {
                var subcats = cat.subcats.map(subcat => subcat._id)
                return {_id: cat._id, id: cat._id, label: cat.label, subcats}
            })
            res.json({target: cats})
        } else if (listName == 'subcats') {
            var subcats = []
            req.mycats.map(cat => {
                cat.subcats.map(subcat => {
                    subcats.push({_id: subcat._id, id: subcat._id, label: subcat.label})
                })
            })
            res.json({target: subcats})
        } else if (listName == 'contacts') {
            var contacts = []
            req.friends.map(fnd => {
                contacts.push({_id: fnd.id, id: fnd.id, label: fnd.name})
            })
            res.json({target: contacts})
        } else {
            res.status(418).json({errorMessage: 'Internal Error!'})
        }
    })

    return listsRouter
}