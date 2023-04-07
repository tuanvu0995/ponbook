import StickySidebar from 'sticky-sidebar-v2'

$(function () {
  var sidebar = new StickySidebar('#sidebar', {
    topSpacing: 50,
    bottomSpacing: 50,
    containerSelector: '#main-content',
    innerWrapperSelector: '.sidebar__inner',
    scrollContainer: 'body',
    minWidth: 768,
  })
})
