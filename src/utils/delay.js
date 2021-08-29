module.exports = function delay(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}
