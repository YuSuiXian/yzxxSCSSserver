const fs = require('fs')
const path = require('path')
const dayjs = require('dayjs')
const uuid = require('../../utils/uuid')
const { query, validationResult } = require('express-validator/check')

module.exports = function studentInfo(req, res) {
  const filePath = path.join(
    __dirname,
    '../../../public/json/student_info.json'
  )
  const data = {
    nick: req.query.name,
    phoneNumber: req.query.phoneNumber,
    class: req.query.class,
    grade: req.query.grade,
    course: req.query.course,
    ambition: req.query.ambition,
  }

  const read = JSON.parse(fs.readFileSync(filePath, 'utf8'))

  read.count = read.data.length
  read.data.push({
    data: data,
    date: dayjs().format(),
    id: uuid()
  })

  fs.writeFileSync(filePath, JSON.stringify(read));
  return true
}
