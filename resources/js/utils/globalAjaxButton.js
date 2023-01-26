import axios from 'axios'
import createPopover from './popover'

export default function globalAjaxButton() {
  var buttons = document.querySelectorAll(`.button.is-ajax`)

  if (buttons.length === 0) {
    return
  }

  console.log('Found ' + buttons.length + ' ajax buttons.')

  buttons.forEach(function (el) {
    el.classList.add('is-working')
    el.addEventListener('click', function (event) {
      event.stopPropagation()
      el.classList.toggle('is-loading')
      doAjax(el) // <== HERE
    })
  })

  function doAjax(element) {
    const url = element.dataset.url
    const method = element.dataset.method
    const data = element.dataset.data

    axios({
      method: method,
      url: url,
      data: data,
    })
      .then((response) => {
        response.data.message && createPopover(element, response.data.message, { timeout: 3000 })
        element.classList.toggle('is-loading')
      })
      .catch((error) => {
        createPopover(element, error.response.data.message, { timeout: 3000 })
        element.classList.toggle('is-loading')
      })
  }
}
