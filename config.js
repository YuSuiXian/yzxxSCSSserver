const cookieParser = require('cookie-parser')

module.exports = function (app, express) {
  app.use(cookieParser())
  // express.static must come after stylus middleware & before routes //
  app.use(express.static(__dirname + '/public'))
  // require(__dirname + '/server/model/database')(app)
  require(__dirname + '/src/routers/index')(app, express)
}
