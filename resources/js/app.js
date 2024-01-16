import { dropdowns, initImageLazyLoad, copyToClipboard, actionButtons } from './functions'
import '../scss/app.scss'

document.addEventListener('DOMContentLoaded', function () {
  window.copyToClipboard = copyToClipboard

  /**
   * Navbar burger
   */
  $('.navbar-burger').click(function () {
    $('.navbar-burger').toggleClass('is-active')
    $('.sidemenu__container').toggleClass('is-active')
  })

  dropdowns('.navbar-item.has-dropdown')
  actionButtons()

  initImageLazyLoad()
})
