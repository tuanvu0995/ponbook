import { customFetch } from './modules/utils/customFetch'

export function dropdowns(selector) {
  var dropdowns = document.querySelectorAll(`${selector}:not(.is-hoverable)`)

  if (dropdowns.length > 0) {
    dropdowns.forEach(function (el) {
      el.addEventListener('click', function (event) {
        event.stopPropagation()

        closeDropdowns() // <== HERE
        el.classList.toggle('is-active')
      })
    })

    document.addEventListener('click', function (event) {
      closeDropdowns()
    })
  }

  function closeDropdowns() {
    dropdowns.forEach(function (el) {
      el.classList.remove('is-active')
    })
  }
}

export function initImageLazyLoad() {
  var lazyImages = [].slice.call(document.querySelectorAll('img.lazy-image'))

  if ('IntersectionObserver' in window) {
    let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target
          lazyImage.src = lazyImage.dataset.src
          lazyImageObserver.unobserve(lazyImage)
          lazyImage.onload = function () {
            lazyImage.classList.remove('lazy-image')
          }
        }
      })
    })

    lazyImages.forEach(function (lazyImage) {
      lazyImageObserver.observe(lazyImage)
    })
  }
}

export function copyToClipboard(text) {
  const el = document.createElement('input')
  document.body.appendChild(el)
  el.value = text
  el.select()
  el.setSelectionRange(0, 99999) // For mobile devices
  navigator.clipboard.writeText(el.value)
  document.body.removeChild(el)
}

export function actionButtons() {
  // .is-action and contains data-action
  var buttons = document.querySelectorAll('.is-action[data-action]')

  if (buttons.length === 0) return

  console.log('Found ' + buttons.length + ' action buttons.')

  buttons.forEach(function (el) {
    el.classList.add('is-working')
    el.addEventListener('click', function (event) {
      event.stopPropagation()
      el.classList.toggle('is-loading')
      doAjax(el) // <== HERE
    })
  })

  function doAjax(element) {
    const url = element.dataset.action
    const data = element.dataset.data
    const toggle = element.dataset.toggle

    customFetch(url, {
      method: 'POST',
      body: data ?? null,
    })
      .then((response) => {
        toggle && element.classList.toggle(toggle)
        element.classList.toggle('is-loading')
        Toastify({
          text: response.message,
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
