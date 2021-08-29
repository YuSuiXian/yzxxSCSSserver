// @ts-nocheck
'use strict'
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i]
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
        }
        return t
      }
    return __assign.apply(this, arguments)
  }
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j]
    return r
  }
exports.__esModule = true
exports.deepAssignReverse = exports.deepAssign = void 0
/** Deep merge objects to the first one */
var deepAssign = function (originObject) {
  var assignObjects = []
  for (var _i = 1; _i < arguments.length; _i++) {
    assignObjects[_i - 1] = arguments[_i]
  }
  if (assignObjects.length === 0) return originObject
  /** Object being merged */
  var assignObject = assignObjects.shift() || {}
  Object.keys(assignObject).forEach(function (property) {
    if (
      typeof originObject[property] === 'object' &&
      !Array.isArray(originObject[property]) &&
      typeof assignObject[property] === 'object' &&
      !Array.isArray(assignObject[property])
    )
      exports.deepAssign(originObject[property], assignObject[property])
    else if (typeof assignObject[property] === 'object')
      if (Array.isArray(assignObject[property]))
        originObject[property] = __spreadArrays(assignObject[property])
      else originObject[property] = __assign({}, assignObject[property])
    else originObject[property] = assignObject[property]
  })
  return exports.deepAssign.apply(
    void 0,
    __spreadArrays([originObject], assignObjects)
  )
}
exports.deepAssign = deepAssign
/** Deep merge objects to the last one */
var deepAssignReverse = function () {
  var assignObjects = []
  for (var _i = 0; _i < arguments.length; _i++) {
    assignObjects[_i] = arguments[_i]
  }
  if (assignObjects.length === 0) throw new Error('No param is given')
  if (assignObjects.length === 1) return assignObjects[0]
  var assignObject = assignObjects.pop()
  var originObject = assignObjects.pop()
  Object.keys(originObject).forEach(function (property) {
    if (assignObject[property] === undefined)
      if (typeof originObject[property] === 'object')
        if (Array.isArray(originObject[property]))
          assignObject[property] = __spreadArrays(originObject[property])
        else assignObject[property] = __assign({}, originObject[property])
      else assignObject[property] = originObject[property]
    else if (
      typeof assignObject[property] === 'object' &&
      !Array.isArray(assignObject) &&
      typeof originObject[property] === 'object' &&
      !Array.isArray(originObject[property])
    )
      exports.deepAssignReverse(originObject[property], assignObject[property])
  })
  return exports.deepAssignReverse.apply(
    void 0,
    __spreadArrays(assignObjects, [assignObject])
  )
}
exports.deepAssignReverse = deepAssignReverse
