export default function globalLoadingButton() {
  var buttons = document.querySelectorAll(`.button.has-loading`)

  if (buttons.length === 0) {
    return
  }

  console.log('Found ' + buttons.length + ' loading buttons.')

  buttons.forEach(function (el) {
    el.classList.add('is-working')
    el.addEventListener('click', function (event) {
      event.stopPropagation()
      el.classList.toggle('is-loading')
    })
  })
}
