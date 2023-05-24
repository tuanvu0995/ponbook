import axios from 'axios'
import Toastify from 'toastify-js'

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
    const toggleIconOn = element.dataset.toggleIconOn?.split(' ')
    const toggleIconOff = element.dataset.toggleIconOff?.split(' ')
    const canToggleIcon = toggleIconOn?.length && toggleIconOff?.length

    let icon = element.querySelector('i')
    function toggleIcon(state) {
      if (state) {
        icon.classList.remove(...toggleIconOff)
        icon.classList.add(...toggleIconOn)
      } else {
        icon.classList.remove(...toggleIconOn)
        icon.classList.add(...toggleIconOff)
      }
    }

    axios({
      method: method,
      url: url,
      data: data,
    })
      .then((response) => {
        canToggleIcon && toggleIcon(response.data.state === 'added')
        element.classList.toggle('is-loading')
        Toastify({
          text: response.data.message,
          duration: 3000,
          gravity: 'top', // `top` or `bottom`
          position: 'center', // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover,
          style: {
            color: '#cc0f35',
            background: '#feecf0',
          },
        }).showToast()
      })
      .catch((error) => {
        Toastify({
          text: error.message,
          duration: 3000,
          gravity: 'top', // `top` or `bottom`
          position: 'center', // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover,
          style: {
            color: '#cc0f35',
            background: '#feecf0',
          },
        }).showToast()

        element.classList.toggle('is-loading')
      })
  }
}
