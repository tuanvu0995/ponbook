import axios from 'axios'
import dropdowns from './utils/dropdown'
import globalAjaxButton from './utils/globalAjaxButton'
import globalLoadingButton from './utils/globalLoadingButton'
import 'owl.carousel'
import '../scss/app.scss'
import globalVoteButton from './utils/globalVoteButton'
import globalModalTriggers from './utils/globalModalTrigger'

$(function () {
  globalAjaxButton()
  globalLoadingButton()
  globalVoteButton()
  globalModalTriggers()
  initImageLazyLoad()
  /**
   * Navigation bar
   */
  $('.navbar-burger').click(function () {
    $('.navbar-burger').toggleClass('is-active')
    $('.navbar-menu').toggleClass('is-active')
  })

  dropdowns('.navbar-item.has-dropdown')
  dropdowns('.dropdown')
})

function initImageLazyLoad() {
  var lazyImages = [].slice.call(document.querySelectorAll('img.image-lazy'))

  if ('IntersectionObserver' in window) {
    let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target
          lazyImage.src = lazyImage.dataset.src
          lazyImage.classList.remove('image-lazy')
          lazyImageObserver.unobserve(lazyImage)
        }
      })
    })

    lazyImages.forEach(function (lazyImage) {
      lazyImageObserver.observe(lazyImage)
    })
  } else {
    // Possibly fall back to event handlers here
  }
}

function quillImageHandler(editor, options = {}) {
  function selectLocalImage() {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.click()

    // Listen upload local image and save to server
    input.onchange = () => {
      const file = input.files[0]

      // file type is only image.
      if (/^image\//.test(file.type)) {
        saveToServer(file)
      } else {
        console.warn('You could only upload images.')
      }
    }
  }

  function saveToServer(file) {
    const fd = new FormData()
    fd.append('image', file)
    fd.append('type', 'comment')
    fd.append('videoId', options.videoId)

    axios({
      method: 'post',
      url: '/api/uploads/image',
      data: fd,
    })
      .then((response) => {
        console.log(response)
        const url = response.data.image
        insertToEditor(url)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  function insertToEditor(url) {
    // push image url to rich editor.
    const range = editor.getSelection()
    editor.insertEmbed(range.index, 'image', BASE_URL + '/uploads/' + url)
  }

  // quill editor add image handler
  editor.getModule('toolbar').addHandler('image', () => {
    selectLocalImage()
  })
}

window.quillImageHandler = quillImageHandler
