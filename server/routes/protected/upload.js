var Image = require('../../models/image')
var UserImage = require('../../models/userImage')
var Expense = require('../../models/expense')
var InPromise = require('../../util/inpromise.js')
var resUtil = require('../../util/resutil.js')
var sharp = require('sharp')

module.exports = function (app, express) {
    var uploadRouter = express.Router()

    uploadRouter.post('/userimg', function (req, res) {
        InPromise
            .do(()=>sharp(req.file.buffer))
            .then(imo => Promise.all([imo, imo.metadata()]))
            .then(pair => {
                return pair
            })
            .then(pair => {
                pair[0] = pair[0].resize(240, 240)
                    .background({r: 255, g: 255, b: 255, alpha: 1})
                    .embed()
                return pair
            })
            .then(pair => pair[0].toBuffer())
            .then(buffer => ({
                data: buffer,
                contentType: req.file.mimetype,
                originalName: req.file.originalname,
                owner: req.decoded.user.email,
                ownerId: req.decoded.user._id,
            }))
            .then(img => InPromise.mongo.save({entity: new UserImage(img)}))
            .then(saved => ({path: req.file.path, filename: req.file.filename, fileid: saved._id}))
            .then(resUtil.success(res, 'Image saved.'))
            .catch(resUtil.error(res))
    })

    uploadRouter.post('/toexp', function (req, res) {
        InPromise
            .do(() => sharp(req.file.buffer))
            .then(imo => Promise.all([imo, imo.metadata()]))
            .then(pair => {
                return pair
            })
            .then(pair => {
                if (pair[1].width > pair[1].height) {
                    pair[0] = pair[0].rotate(90)
                }
                return pair
            })
            .then(pair => {
                // height is now width
                if (pair[1].height > 600) {
                    pair[0] = pair[0].resize(600, null)
                }
                return pair
            })
            .then(pair => pair[0].toBuffer())
            .then(buffer => ({
                data: buffer,
                contentType: req.file.mimetype,
                originalName: req.file.originalname,
                owner: req.decoded.user.email,
                ownerId: req.decoded.user._id,
            }))
            .then(img => InPromise.mongo.save({entity: new Image(img)}))
            .then(saved => ({
                date: new Date(),
                owner: req.decoded.user.email,
                ownerId: req.decoded.user._id,
                image: saved._id,
                shares: [{
                    paid: 0,
                    amount: 0,
                    accepted: true,
                    owner: req.decoded.user.email,
                }]
            }))
            .then(expense => InPromise.mongo.save({entity: new Expense(expense), errorMessage: 'Expense save failed.'}))
            .then(resUtil.success(res, 'Expense saved.'))
            .catch(resUtil.error(res))
    })

    return uploadRouter
}
