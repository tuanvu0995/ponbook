import { dropdowns, copyToClipboard, actionButtons, initLogout, lazyImages } from './functions'
import {initSearchDialog} from './search-dialog'
import '../scss/app.scss'

window.copyToClipboard = copyToClipboard

;(function () {
  lazyImages()
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
  initSearchDialog()
})()
