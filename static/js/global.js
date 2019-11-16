'use strict'

function hide(popup, event) {
  if (event && event.target !== document.getElementById(popup).parentElement) {
    return
  }
  document.getElementById(popup).parentElement.classList.remove('show')
}

function show(popup) {
  document.getElementById(popup).parentElement.classList.add('show')
  return false
}
