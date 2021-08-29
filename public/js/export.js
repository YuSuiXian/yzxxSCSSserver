// @ts-nocheck
import { createApp, reactive } from 'https://unpkg.com/petite-vue?module'

function doit(type, fn, dl) {
  console.log(21321)
  var elt = document.getElementById('data-table')
  var wb = XLSX.utils.table_to_book(elt, { sheet: 'Sheet JS' })
  return dl
    ? XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' })
    : XLSX.writeFile(wb, fn || 'SheetJSTableExport.' + (type || 'xlsx'))
}

function initTable(arr) {
  const table = [['姓名', '年级', '班级', '课程', '电话号码', '志向']]

  arr.forEach((val) => {
    val = val.data
    table.push([
      val.nick,
      val.grade,
      val.class,
      val.course,
      val.phoneNumber,
      val.ambition,
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
  const { data, count, retcode } = await getData()

  const store = reactive({
    data,
    count,
    retcode,
  })
  console.log(store)
  createApp({
    store,
    doit,
    initTable,
  }).mount()
}

init()
