import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'

const UPLOAD_URL = '/api/videos'

const getUploadUrl = (uid) => {
  return `${UPLOAD_URL}/${uid}/image`
}

const ReactUploadForm = () => {
  const fileRef = React.useRef(null)
  const [images, setImages] = useState([])

  useEffect(() => {
    setImages(videoData.images)
  }, [])

  const onFileSelected = async () => {
    const file = fileRef.current.files[0]
    const length = fileRef.current.files.length

    for (let index = 0; index < length; index++) {
      await upload(fileRef.current.files[index])
    }

    fileRef.current.value = null
  }

  const upload = async (selectedFile) => {
    const formData = new FormData()
    formData.append('image', selectedFile)

    try {
      const rsp = await axios.post(getUploadUrl(videoData.uid), formData)
      setImages([...images, rsp.data.image])
    } catch (err) {
      console.log('Error uploading file: ', err)
    }
  }

  return (
    <div className="ReactUploadForm">
      <div className="mb-6">
        <div className="file is-boxed">
          <label className="file-label">
            <input
              ref={fileRef}
              className="file-input"
              type="file"
              name="resume"
              onClick={() => fileRef.current.click()}
              onChange={onFileSelected}
              multiple
            />
            <span className="file-cta">
              <span className="file-icon">
                <i className="fa fa-plus-square-o is-medium"></i>
              </span>
              <span className="file-label">Choose a file…</span>
            </span>
          </label>
        </div>
      </div>

      <form className="columns is-multiline">
        {images.map((image, index) => (
          <div key={image + 'index'} className="column is-5 px-2 py-2 ">
            <figure className="image is-square">
              <img src={`${BASE_URL}/files/${image}`} />
            </figure>
          </div>
        ))}
      </form>
    </div>
  )
}

global.renderUploadForm = function (elementId = 'root') {
  const root = ReactDOM.createRoot(document.getElementById(elementId))
  root.render(<ReactUploadForm />)
}
