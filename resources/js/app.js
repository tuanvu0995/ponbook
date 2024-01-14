import { dropdowns, initImageLazyLoad, copyToClipboard } from './functions'
import '../scss/app.scss'

$(function () {

  window.copyToClipboard = copyToClipboard

  /**
   * Navbar burger
   */
  $('.navbar-burger').click(function () {
    $('.navbar-burger').toggleClass('is-active')
    $('.sidemenu__container').toggleClass('is-active')
  })

  dropdowns('.navbar-item.has-dropdown')

  initImageLazyLoad()
})
