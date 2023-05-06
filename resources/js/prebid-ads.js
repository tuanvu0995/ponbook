window.addEventListener('load', () => {
  let test = new Request('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
    method: 'HEAD',
    mode: 'no-cors',
  })

  // (B) FIRE THE REQEST
  fetch(test).catch(() => {
    document.getElementById('banner-message').style.display = 'block'
  })
})
