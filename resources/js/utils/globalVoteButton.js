import axios from 'axios'
import createPopover from './popover'

export default function globalVoteButton() {
  var buttons = document.querySelectorAll(`.vote-button`)

  if (buttons.length === 0) {
    return
  }

  console.log('Found ' + buttons.length + ' votes buttons.')

  buttons.forEach(function (el) {
    el.classList.add('is-working')
    el.addEventListener('click', function (event) {
      event.stopPropagation()
      el.classList.toggle('is-loading')
      doAjax(el) // <== HERE
    })
  })

  function doAjax(element) {
    const url = element.dataset.url
    const method = element.dataset.method
    const vote = element.dataset.vote
    const uid = element.dataset.uid

    axios({
      method: method,
      url: url,
      data: { vote },
    })
      .then((response) => {
        response.data.message && createPopover(element, response.data.message, { timeout: 3000 })
        const { voteUpCount, voteDownCount } = response.data
        const voteUpCountElement = document.getElementById(`post-${uid}-up-vote-count`)
        const voteDownCountElement = document.getElementById(`post-${uid}-down-vote-count`)
        voteUpCountElement.innerHTML = voteUpCount
        voteDownCountElement.innerHTML = voteDownCount
      })
      .catch((error) => {
        console.log(error)
        createPopover(element, error.response.data.message, { timeout: 3000 })
        element.classList.toggle('is-loading')
      })
  }
}
