import ImageViewer from 'awesome-image-viewer'

function onVideoImageClick(index) {
  const elements = document.querySelectorAll('.owl-carousel .owl-carousel-item img')
  if (!elements) return
  const images = []
  elements.forEach((element) => {
    images.push({ mainUrl: element.src })
  })
  new ImageViewer({
    images,
    currentSelected: index,
    isZoomable: false,
    stretchImages: true,
    showThumbnails: false,
  })
}

window.onVideoImageClick = onVideoImageClick
