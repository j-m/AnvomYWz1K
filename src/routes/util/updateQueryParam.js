'use strict'

function updateQueryParam(href, param, newValue, oldValue) {
  if (!href.includes('?')) {
    return href += `?${param}=${newValue}`
  }
  if (!href.includes(`${param}=${oldValue}`)) {
    return href += `&${param}=${newValue}`
  }
  return href.replace(`${param}=${oldValue}`,`${param}=${newValue}`)
}

module.exports = updateQueryParam
