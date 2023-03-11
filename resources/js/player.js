import axios from 'axios'
import Hls from 'hls.js'
import createPopover from './utils/popover'

const playIcon = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItcGxheS1jaXJjbGUiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIj48L2NpcmNsZT48cG9seWdvbiBwb2ludHM9IjEwIDggMTYgMTIgMTAgMTYgMTAgOCI+PC9wb2x5Z29uPjwvc3ZnPg==`
const pauseIcon = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItcGF1c2UtY2lyY2xlIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PGxpbmUgeDE9IjEwIiB5MT0iMTUiIHgyPSIxMCIgeTI9IjkiPjwvbGluZT48bGluZSB4MT0iMTQiIHkxPSIxNSIgeDI9IjE0IiB5Mj0iOSI+PC9saW5lPjwvc3ZnPg==`

window.initLivePlayer = function (element, options = {}) {
  getRandomModel(options, (model) => {
    LivePlayer(element, { url: model.stream.url, name: model.username, ...options })
  })
}

window.LivePlayer = function (element, { url, name, refId, ...options }) {
  element.style.display = 'none'
  const streamUrl = url
  const modelName = name
  const video = document.createElement('video')
  element.classList.add('PLivePlayer')

  element.appendChild(video)

  const controls = document.createElement('div')
  controls.classList.add('PLivePlayer__Controls')

  element.appendChild(controls)

  const label = document.createElement('div')
  label.classList.add('PLivePlayer__Label')
  element.appendChild(label)

  const liveStatus = document.createElement('span')
  liveStatus.classList.add('live-status')
  label.appendChild(liveStatus)

  const text = document.createElement('a')
  text.innerText = modelName + ' (live)'
  label.appendChild(text)

  createPopover(text, `Go to ${modelName}'s room`)

  const actionList = document.createElement('div')
  actionList.classList.add('PLivePlayer__Actions')
  element.appendChild(actionList)

  const joinButton = document.createElement('a')
  joinButton.innerText = 'Join Me for free'
  joinButton.classList.add('PLivePlayer__JoinBtn')
  actionList.appendChild(joinButton)

  const tipButton = document.createElement('a')
  tipButton.innerText = 'Send Tip'
  tipButton.classList.add('PLivePlayer__TipBtn')
  actionList.appendChild(tipButton)
  const clickable = [text, tipButton, joinButton]
  clickable.forEach((el) => {
    el.addEventListener('click', () => {
      const queryParams = getLiveParams(options)
      if (el === joinButton) {
        queryParams.showModal = 'signup'
      }
      queryParams.sound = 'on'
      const queryString = new URLSearchParams(queryParams).toString()
      window.open('https://go.xlirdr.com/api/goToTheRoom?userId=' + refId + '&' + queryString)
    })
  })

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = streamUrl
  } else if (Hls.isSupported()) {
    var hls = new Hls()
    hls.loadSource(streamUrl)
    hls.attachMedia(video)

    hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
      if (element.style.display === 'none') {
        element.style.display = 'block'
        console.log('loaded')
      }
    })

    const playButton = document.createElement('button')
    playButton.classList.add('PLivePlayer__Controls-Play')
    const playIconBtn = document.createElement('img')
    playIconBtn.setAttribute('src', playIcon)
    playButton.appendChild(playIconBtn)
    controls.appendChild(playButton)

    const pauseButton = document.createElement('button')
    pauseButton.classList.add('PLivePlayer__Controls-Play')
    const pauseIconBtn = document.createElement('img')
    pauseIconBtn.setAttribute('src', pauseIcon)
    pauseButton.appendChild(pauseIconBtn)
    controls.appendChild(pauseButton)

    const videoWorks = !!video.canPlayType
    if (videoWorks) {
      video.controls = false
      video.muted = true
      video.play()
      playButton.style.display = 'none'
    }

    // eslint-disable-next-line no-inner-declarations
    function togglePlay() {
      video.muted = false
      if (video.paused || video.ended) {
        video.play()
        playButton.style.display = 'none'
        pauseButton.style.display = 'inline-block'
      } else {
        video.pause()
        playButton.style.display = 'inline-block'
        pauseButton.style.display = 'none'
      }
    }
    playButton.addEventListener('click', togglePlay)
    pauseButton.addEventListener('click', togglePlay)
  }
}

function getRandomModel(options, callback) {
  const queryObject = getLiveParams(options)
  axios.get('/api/models', { params: queryObject }).then((response) => {
    callback(response.data.models[0])
  })
}

function getLiveParams(options) {
  return {
    limit: 1,
    language: options.lang,
    broadcastGender: 'female',
    modelsLanguage: options.lang,
    modelsCountry: options.country,
  }
}
