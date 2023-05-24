import { uniq } from 'lodash'
import getToggleAjaxHandler from './getToggleAjaxHandler'

export default function initFavoriteButton() {
  if (typeof IS_LOGGED_IN === 'undefined' || !IS_LOGGED_IN) return
  const buttons = document.querySelectorAll('.is-favorite-button')

  const videoUids = []
  buttons.forEach((button) => videoUids.push(button.dataset.videoUid))
  if (videoUids.length === 0) return

  axios
    .post('/api/videos/favorite-status', {
      videoUids: uniq(videoUids),
    })
    .then((response) => applyFavoriteStatus(_.filter(response.data, { isFavorite: true })))
    .catch((error) => console.log('initFavoriteButton:', error))
}

function applyFavoriteStatus(results) {
  for (const video of results) {
    const buttons = document.querySelectorAll(`.is-favorite-button[data-video-uid="${video.uid}"]`)
    buttons.forEach((button) => {
      getToggleAjaxHandler(button)(true)
    })
  }
}
