import ImageViewer from 'awesome-image-viewer'

function onVideoImageClick(index) {
  const elements = document.querySelectorAll('.image-preview__item img')
  if (!elements) return
  const images = []
  elements.forEach((element) => {
    images.push({ mainUrl: element.src })
  })
  new ImageViewer({
    images,
    currentSelected: index,
    isZoomable: true,
    stretchImages: true,
    showThumbnails: true,
  })
}

window.onVideoImageClick = onVideoImageClick
