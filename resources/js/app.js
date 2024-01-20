import { dropdowns, copyToClipboard, actionButtons, initLogout } from './functions'
import '../scss/app.scss'

document.addEventListener('DOMContentLoaded', function () {
  window.copyToClipboard = copyToClipboard
  /**
   * Navbar burger
   */
  const navbarButtons = document.querySelectorAll('.navbar-burger.is-sidemenu')
  navbarButtons.forEach(function (el) {
    el.addEventListener('click', function () {
      document.querySelector('.navbar-burger').classList.toggle('is-active')
      document.querySelector('.sidemenu__container').classList.toggle('is-active')
    })
  })

  dropdowns('.navbar-item.has-dropdown')
  actionButtons()
  initLogout()
})
