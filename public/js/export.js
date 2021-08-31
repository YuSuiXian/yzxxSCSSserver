// @ts-nocheck
import { createApp, reactive } from 'https://unpkg.com/petite-vue?module'

// petite-vue https://github.com/vuejs/petite-vue
// sheetJs https://github.com/SheetJS/sheetjs

function doit(type, fn, dl) {
  let elt = document.getElementById('data-table')
  let wb = XLSX.utils.table_to_book(elt, { sheet: 'Sheet JS' })
  return dl
    ? XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' })
    : XLSX.writeFile(wb, fn || 'StudentSCSSExport.' + (type || 'xlsx'))
}

function initTable(arr) {
  const table = [
    [
      '索引',
      '姓名',
      '电话号码',
      '年级',
      '班级',
      '第一志愿',
      '第二志愿',
      '第三志愿',
      '登记日期',
      'UUID',
    ],
  ]

  arr.forEach((value, index) => {
    const student = value.data
    table.push([
      ++index,
      student.name,
      student.phoneNumber,
      student.grade,
      student.class,
      student.aspirationFirst,
      student.aspirationSecond,
      student.aspirationThree,
      value.date,
      value.id,
    ])
  })

  console.table(table)
  const ws = XLSX.utils.aoa_to_sheet(table)
  const table_string = XLSX.utils.sheet_to_html(ws, {
    id: 'data-table',
    editable: true,
  })
  return table_string
}

async function getData() {
  return await fetch('/json/student_info.json')
    .then((res) => res.json())
    .catch((err) => alert(err))
}

async function init() {
  const { data, count } = await getData()

  const store = reactive({
    data,
    count,
  })

  console.log(store)
  createApp({
    store,
    doit,
    initTable,
  }).mount()
}

init()
