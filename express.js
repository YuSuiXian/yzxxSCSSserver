/*
	boilerplate for initializing an express app
*/

const fs = require('fs')
const express = require('express')
const dayjs = require('dayjs')
const compression = require('compression')
const mnstore = require('connect-mongo')
const session = require('express-session')
const dotenv = require('dotenv')
const i18n = require('i18n')
const path = require('path')
const createLogger = require('./logger')

const envConfig = dotenv.config({
  path: path.resolve(__dirname, './.env.local'),
  encoding: 'utf8',
  debug: false,
}).parsed

if (!envConfig)
  console.warn('The environment configuration file cannot be found')

const isDEV = process.env.NODE_ENV !== 'production'

console.log('Mode:', isDEV ? 'development' : 'Production')

let http,
  https = undefined
const CERTBOT_PATH = '/.well-known/acme-challenge'

module.exports = function () {
  return express()
}

module.exports.init = function (path, app, _i18n, sessions, dbName) {
  app = app || express()
  app.set('host', process.env.NODE_ENV || 'localhost')
  app.set('http_port', process.env.HTTP_PORT || 8080)
  app.set('https_port', process.env.HTTPS_PORT || 8443)
  app.locals.dayjs = dayjs
  app.locals.logger = createLogger('server')
  app.locals.__DEV__ = isDEV
  app.locals.pretty = process.env.NODE_ENV == 'localhost'
  app.set('view engine', 'html')
  app.set('views', path + '/src/views')
  // @ts-ignore
  app.engine('html', require('ejs').__express)
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  if (sessions) app.use(session(sessions))
  if (_i18n) {
    i18n.configure(_i18n)
    app.use(i18n.init)
  }
  if (isDEV) {
    // Enable gzip in the development environment
    app.use(compression())
  }
  // redirect all http traffic to https //
  if (process.env.HTTPS === 'true') {
    app.use(function (req, res, next) {
      if (!req.secure && req.url.indexOf(CERTBOT_PATH) == -1) {
        return res.redirect(['https://', req.get('Host'), req.url].join(''))
      }
      next()
    })
  }
  // redirect www to non-www //
  app.use(function (req, res, next) {
    if (req.headers.host && req.headers.host.slice(0, 4) === 'www.') {
      var newHost = req.headers.host.slice(4)
      return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl)
    }
    next()
  })

  // if (process.env.DB_NAME || dbName) {
  //   app.set('DB_NAME', process.env.DB_NAME || dbName)
  //   app.set('DB_HOST', process.env.DB_HOST || 'localhost')
  //   app.set('DB_PORT', process.env.DB_PORT || 27017)
  //   app.set(
  //     'DB_URL',
  //     process.env.DB_URL ||
  //       'mongodb://' + app.get('DB_HOST') + ':' + app.get('DB_PORT')
  //   )
  //   if (sessions) {
  //     app.use(
  //       session({
  //         resave: false,
  //         saveUninitialized: false,
  //         cookie: {
  //           httpOnly: true,
  //           secure: process.env.HTTPS === 'true',
  //           maxAge: 1209600000,
  //         }, // two weeks
  //         secret:
  //           process.env.SECRET || 'faeb4453e5d14fe6f6d04637f78077c76c73d1bxxxx',
  //         store: mnstore.create({
  //           mongoUrl: app.get('DB_URL') + '/' + app.get('DB_NAME'),
  //         }),
  //       })
  //     )
  //   }
  // }
  // attach project specific configuration //
  require(path + '/config')(app, express)
  return app
}

module.exports.http = function (app, port) {
  http = require('http').createServer(app)
  if (port) app.set('http_port', port)
  return http
}

module.exports.https = function (app, port, keypath) {
  https = require('https').createServer(
    {
      key: fs.readFileSync(
        (keypath || process.env.SSL_KEY_PATH || './ssl') + '/privkey.pem'
      ),
      cert: fs.readFileSync(
        (keypath || process.env.SSL_KEY_PATH || './ssl') + '/fullchain.pem'
      ),
    },
    app
  )
  if (port) app.set('https_port', port)
  return https
}

module.exports.start = function (app) {
  console.log('----------------------------------------------')
  console.log('----------------------------------------------')
  console.log('--------------------SERVER--------------------')
  console.log('------------------RESTARTING------------------')
  console.log('----------------------------------------------')
  console.log('----------------------------------------------')

  if (http === undefined) http = require('http').createServer(app)

  http.listen(app.get('http_port'), function () {
    console.log('* http service listening on port', app.get('http_port'))
  })

  if (https) {
    https.listen(app.get('https_port'), function () {
      console.log('* https service listening on port', https.address().port)
    })
  }
}

module.exports.log = function (logdir) {
  if (fs.existsSync(logdir) == false) {
    var str = dayjs(new Date()).format('MMMM Do YYYY h:mm:ssA') + ' :: '
    fs.mkdir(logdir, { recursive: true }, (e) => {
      e
        ? console.log(e)
        : fs.writeFileSync(
            logdir + '/app.log',
            str + 'initializing app.log' + '\n'
          )
    })
  }
  global.log = function () {
    var str = dayjs().format('MMMM Do YYYY h:mm:ssA') + ' :: '
    for (const p in arguments) str += arguments[p] + ' '
    fs.appendFile(logdir + '/app.log', str + '\n', (e) => {
      console.log(str)
    })
  }
}

global.guid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
