import axios from 'axios'
import Toastify from 'toastify-js'

window.axios = axios
window.pbToast = function (message, type = 'success', { duration = 3000 } = {}) {
  Toastify({
    text: message,
    duration,
    gravity: 'top', // `top` or `bottom`
    position: 'center', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover,
    style: {
      color: '#cc0f35',
      background: '#feecf0',
    },
  }).showToast()
}
