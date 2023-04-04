import StickySidebar from 'sticky-sidebar-v2'

$(function () {
  var sidebar = new StickySidebar('#sidebar', {
    topSpacing: 20,
    bottomSpacing: 20,
    containerSelector: '#main-content',
    innerWrapperSelector: '.sidebar__inner',
    scrollContainer: 'body',
  })
  console.log('Sticky sidebar initialized.', sidebar)
})
