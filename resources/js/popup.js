/**
 * @author		David Do <do huy toan at live dot com>
 * @since		Aug 30, 2014
 * @version		1.0
 * @since		Aug 30, 2014 - Fixed bugs on IE 6,7,8
 
 ***** CHANGE LOGS *****
 * 1.2 - Jul 5, 2013 - Anti Google Chrome Blocker
 * 1.3 - Jul 25, 2013 - Fixed bugs on IE 6,7,8
*/
var Light = Light || {}
window.Light = Light
Light.Popup = {
  popName: 'DavidDo-LightPopup',
  alwaysPop: false, // refresh = new pop
  onNewTab: true,
  defaults: {
    width: window.screen.width,
    height: window.screen.height,
    left: 0,
    top: 0,
    location: 1,
    tollbar: 1,
    status: 1,
    menubar: 1,
    scrollbars: 1,
    resizable: 1,
  },
  newWindowDefaults: {
    width: window.screen.width - 20,
    height: window.screen.height - 20,
  },
  __newWindow: {
    scrollbars: 0,
  },
  __counter: 0,
  create: function (link, options) {
    var optionsOriginal = (options = options || {})
    var me = this
    var popName = me.popName + '_' + me.__counter++
    var keys = ['onNewTab', 'cookieExpires', 'alwaysPop']
    for (var i in keys) {
      var key = keys[i]
      if (typeof options[key] !== 'undefined') {
        eval('var ' + key + ' = options.' + key)
        delete options[key]
      } else {
        eval('var ' + key + ' = me.' + key)
      }
    }
    if (alwaysPop) {
      cookieExpires = -1
    }
    for (var i in me.defaults) {
      if (typeof options[i] === 'undefined') {
        options[i] = me.defaults[i]
        if (!onNewTab && typeof me.newWindowDefaults[i] !== 'undefined') {
          options[i] = me.newWindowDefaults[i]
        }
      }
    }
    for (var i in me.__newWindow) {
      options[i] = me.__newWindow[i]
    }
    var params = []
    for (var i in options) {
      params.push(i + '=' + options[i])
    }
    params = params.join(',')
    var executed = false
    var execute = function (clickedLink) {
      if (me.cookie(popName) === null && !executed) {
        // Jul 5, 2013 - Anti Google Chrome Blocker
        if (
          typeof window.chrome !== 'undefined' &&
          navigator.userAgent.indexOf('Windows') !== -1 &&
          typeof ___lastPopTime !== 'undefined' &&
          ___lastPopTime + 5 > new Date().getTime()
        ) {
          return
        }
        executed = true
        if (onNewTab) {
          var w = window.open(clickedLink, '_blank')
          if (w) {
            window.location.href = link
          }
          w.focus()
        } else {
          var w = window.open(link, '_blank', params)
        }
        w && w.blur() // "w" may null on IE
        window.focus()
        me.cookie(popName, 1, cookieExpires)
        // Jul 5, 2013 - Anti Google Chrome Blocker
        ___lastPopTime = new Date().getTime()
        if (navigator.userAgent.indexOf('Mac OS') !== -1 && typeof window.chrome !== 'undefined') {
          setTimeout(function () {
            if (!w.innerWidth || !w.document.documentElement.clientWidth) {
              me.create(link, optionsOriginal)
            }
          }, 100)
        }
      }
    }

    if (me.cookie(popName) === null && !executed) {
      const pageLinks = document.querySelectorAll('a')
      console.log('page links', pageLinks.length)
      for (let pageLink of pageLinks) {
        if (!pageLink.href) continue
        const onClickHandler = (e) => {
          execute(pageLink.href)
        }
        if (!pageLink.addEventListener) {
          pageLink.setAttribute('target', '_blank')
          pageLink.attachEvent('onclick', onClickHandler)
        } else {
          pageLink.setAttribute('target', '_blank')
          pageLink.addEventListener('click', onClickHandler)
        }
      }
    }
  },
  cookie: function (name, value, days) {
    if (arguments.length === 1) {
      var cookieMatch = document.cookie.match(new RegExp(name + '=[^;]+', 'i'))
      return cookieMatch ? decodeURIComponent(cookieMatch[0].split('=')[1]) : null
    }
    if (days === null || typeof days === 'undefined') {
      expires = ''
    } else {
      var date
      if (typeof days === 'number') {
        date = new Date()
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
      } else {
        date = days
      }
      expires = '; expires=' + date.toUTCString()
    }
    var value = escape(value) + expires + '; path=/'
    document.cookie = name + '=' + value
  },
}
