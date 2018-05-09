module.exports = function (app, express) {
    var mwList = []
    return {
        // register a middleware module and get an index for it
        addMiddleware: function (module) {
            mwList.push(module)
            return mwList.length - 1
        },
        // register a route and add also middleware by given index
        addRoutes: function (mws, route, module) {
            if (mws) {
                for (var j = 0; j < mws.length; j++) {
                    app.use(route, mwList[mws[j]](app, express))
                }
            }
            app.use(route, module(app, express))
        }
    }
}