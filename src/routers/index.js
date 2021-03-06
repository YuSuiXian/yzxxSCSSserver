const dayjs = require('dayjs')
const studentInfo = require('../model/student/info')
const { v4: uuidv4 } = require('uuid')

module.exports = function (app) {
  app.all('*', function (req, res, next) {
    // CORS Config
    res.header(
      'Access-Control-Allow-Origin',
      req.headers.origin || req.headers.referer || req.headers.host || '*'
    )
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, ' +
        'Last-Modified, Cache-Control, Expires, Content-Type, Content-Language, Cache-Control, X-E4M-With,X_FILENAME'
    )
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    res.header('X-Powered-By', 'paimon')
    res.header('CP', 'NOI DSP COR PSA PSD OUR IND COM NAV')
    res.header('X-Content-Type-Options', 'nosniff')
    res.header('X-Xss-Protection', '1; mode=block')
    next()
  })

  app.get('/student/:case', function (req, res) {
    switch (req.params.case) {
      case 'info':
        if (!studentInfo(req, res, app)) return
        res.status(200).json({ code: '200', message: res.__('Success') })
        break
      case 'export':
        res.render('student/export')
        break
      default:
        res
          .status(400)
          .json({ code: '400', message: res.__('InvalidParameter') })
    }
  })

  app.get('/ClassList', async (req, res) => {
    console.log(req.query)
    return res.status(200).json({ message: 'OK' })
  })

  app.get('/Upload', async (req, res) => {
    console.log(req.query)
    if (!studentInfo(req, res)) return
    return res.status(200).json({ message: 'OK' })
  })

  app.get('/get', async (req, res) => {
    console.log(req.query)
    let listClass = ['课程类型一', '课程类型二', '课程类型三', '课程类型四']
    return res
      .status(200)
      .json({ message: 'OK', islist: true, list: listClass })
  })

  app.post('/post', async (req, res) => {
    console.log(req.body)

    return res.status(200).json({ message: 'OK' })
  })

  // 404
  app.get('*', function (req, res) {
    res.status(200).json({
      code: '404',
      message: res.__('NotFound'),
      timestamp: dayjs(new Date()).valueOf(),
    })
  })

  // Error message handling
  app.use(function (err, req, res, next) {
    if (res.headersSent) return next(err)
    const id = uuidv4()
    app.locals.logger.error(
      JSON.stringify({
        errorMessage: err.stack,
        errorId: id,
        date: dayjs().format(),
        req: {
          hostname: req.hostname,
          path: req.path,
          query: req.query,
          req: req.router,
          ip: `${req.ip}^${req.ips}`,
        },
      })
    )

    res.status(500).json({
      code: '500',
      errorId: id,
      path: req.path,
      message: err.toString() || res.__('UnknownError'),
    })
  })
}
