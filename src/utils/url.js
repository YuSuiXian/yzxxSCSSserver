/**
 * check if string is a valid url
 */
module.exports = function isUrl(test) {
  if (typeof test !== 'string' || test === '') return false

  // url Math
  const result = /^(?:\w+:)?\/\/(\S+)$/u.exec(test)

  if (!result) return false

  const address = result[1]

  if (!address) return false

  return (
    // address with localhost
    /^localhost[:?\d]*(?:[^:?\d]\S*)?$/u.test(address) ||
    // address without localhost
    /^[^\s.]+\.\S{2,}$/u.test(address)
  )
}

module.exports = function isAbsoluteUrl(test) {
  return test.startsWith('/')
}
