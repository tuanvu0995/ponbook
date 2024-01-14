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
  } else {
    // Possibly fall back to event handlers here
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
