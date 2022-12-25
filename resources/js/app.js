import '../scss/app.scss'

$(document).ready(function () {
  /**
   * Navigation bar
   */
  $('.navbar-burger').click(function () {
    $('.navbar-burger').toggleClass('is-active')
    $('.navbar-menu').toggleClass('is-active')
  })

  $('#user-dropdown-link').click(function () {
    $('#user-dropdown').toggleClass('is-active')
  })
})
