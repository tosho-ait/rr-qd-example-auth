
module.exports = function (app, express) {
    var processFilter = express.Router()

    processFilter.use(function (req, res, next) {
        if(req.body.filter && req.body.filter.length > 1){
            var includeCats = []
            var includeSubcats = []
            var exclude = []
            var filter = req.body.filter.split(" ");
            var mycats = req.mycats
            for (var i = 0; i < filter.length; i++) {
                var fText = filter[i]
                if(!fText.startsWith("-") && fText.length > 1){
                    for (var j = 0; j < mycats.length; j++){
                        var cat = mycats[j]
                        if(cat.label.startsWith(fText)){
                            includeCats.push(cat._id)
                        }
                        for (var m = 0; m < cat.subcats.length; m++) {
                            var subcat = cat.subcats[m]
                            if(subcat.label.startsWith(fText)){
                                includeSubcats.push(subcat._id)
                            }
                        }
                    }
                }
            }
            for (var i = 0; i < filter.length; i++) {
                var fText = filter[i]
                if(fText.startsWith("-")){


                }
            }
            req.includeCats = includeCats
            req.includeSubcats = includeSubcats
            req.exclude = exclude
        }
        next()
    })

    return processFilter
}
