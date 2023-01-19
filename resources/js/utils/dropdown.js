export default function dropdowns(selector) {
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
