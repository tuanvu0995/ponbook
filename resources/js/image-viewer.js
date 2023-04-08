import ImageViewer from 'awesome-image-viewer'

function onVideoImageClick(index) {
  const elements = document.querySelectorAll('.owl-carousel .owl-carousel-item img')
  if (!elements) return
  const images = []
  elements.forEach((element) => {
    images.push({
      mainUrl: element.dataset.src,
      thumbnailUrl: element.src,
      description: element.alt,
    })
  })
  new ImageViewer({
    images,
    currentSelected: index,
  })
}

window.onVideoImageClick = onVideoImageClick
