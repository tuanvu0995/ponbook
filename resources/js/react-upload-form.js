import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import ImageUpload from './ImageUpload'

const ReactUploadForm = () => {
  const fileRef = React.useRef(null)
  const [images, setImages] = useState([])

  useEffect(() => {
    setImages(videoData.image_urls)
  }, [])

  return (
    <div className="ReactUploadForm">
      <ImageUpload
        images={images}
        onChange={(changedImages) => setImages(changedImages)}
        coverImage={videoData.cover}
        mainImage={videoData.image}
      />
    </div>
  )
}

global.renderUploadForm = function (elementId = 'root') {
  const root = ReactDOM.createRoot(document.getElementById(elementId))
  root.render(<ReactUploadForm />)
}
