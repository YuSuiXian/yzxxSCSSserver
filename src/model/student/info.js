// @ts-nocheck
const fs = require('fs')
const path = require('path')
const dayjs = require('dayjs')
const { v4: uuidv4 } = require('uuid')

module.exports = function studentInfo(req, res, app) {
  const filePath = path.join(
    __dirname,
    '../../../public/json/student_info.json'
  )

  const data = {
    name: req.query.name,
    phoneNumber: req.query.phoneNumber,
    grade: req.query.grade,
    class: req.query.class,
    aspirationFirst: req.query.aspirationFirst,
    aspirationSecond: req.query.aspirationSecond,
    aspirationThree: req.query.aspirationThree,
  }

  let read = {
    data: [],
    count: 0,
  }

  fs.access(filePath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
    if (err) {
      app.locals.logger.warning(
        `${filePath} ${err.code === 'ENOENT' ? '不存在' : '只可读'}`
      )
    } else {
      read = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    }
    read.count = read.data.length
    read.data.push({
      data,
      date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      id: uuidv4(),
    })

    fs.writeFileSync(filePath, JSON.stringify(read))
  })

  return true
}
