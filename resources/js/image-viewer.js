import ImageViewer from 'awesome-image-viewer'

let imageViewer = null

function onVideoImageClick(index) {
  if (!imageViewer) {
    const elements = document.querySelectorAll('.image-preview__item img')
    if (!elements) return
    const images = []
    elements.forEach((element) => {
      images.push({ mainUrl: element.src })
    })
    imageViewer = new ImageViewer({
      images,
      currentSelected: index,
      isZoomable: true,
      stretchImages: true,
      showThumbnails: true,
    })
  } else {
    console.log('onVideoImageClick', imageViewer)
    console.log(imageViewer.show)
    imageViewer.showImages()
  }
}

window.onVideoImageClick = onVideoImageClick
