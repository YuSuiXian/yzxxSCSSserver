//	https://www.npmjs.com/package/@braitsch/express
const path = require('path')
const express = require('./express')

const app = express()

express.log('./logs')

express.http(app)

express.init(
  __dirname,
  app,
  // See https://www.npmjs.com/package/i18n
  {
    locales: ['en', 'zh'],
    directory: path.join(__dirname, './src/locales'),
    queryParameter: 'lang',
    extension: '.json',
    defaultLocale: 'zh',
  },
  // See https://www.npmjs.com/package/express-session
  {
    secret:
      'Paimons dizzy already. Oh, no! Paimon used up all her brain juice!',
    cookie: { maxAge: 60000 },
  }
)

express.start(app)
