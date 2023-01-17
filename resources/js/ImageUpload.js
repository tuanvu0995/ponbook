import React from 'react'

const UPLOAD_URL = '/api/videos'

const getUploadUrl = (uid) => {
  return `${UPLOAD_URL}/${uid}/image`
}

const deleteImageUrl = (uid) => {
  return getUploadUrl(uid)
}

function ImageUpload({ images, mainImage, coverImage, onChange }) {
  const fileRef = React.useRef(null)
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
      onChange([...images, rsp.data.image])
    } catch (err) {
      console.log('Error uploading file: ', err)
    }
  }

  const deleteImage = async (image) => {
    try {
      await axios.delete(deleteImageUrl(videoData.uid), {
        data: { image },
      })
      onChange(images.filter((img) => img !== image))
    } catch (err) {
      console.log('Error deleting file: ', err)
    }
  }

  const setImageType = async (image, type) => {
    try {
      await axios.put(getUploadUrl(videoData.uid), {
        image,
        toType: type,
      })
      //   onChange(images.filter((img) => img !== image))
    } catch (err) {
      console.log('Error deleting file: ', err)
    }
  }

  const renderImage = (image, index) => {
    return (
      <article className="imageUpload__item media" key={`image-${index}`}>
        <figure className="media-left">
          <p className="image is-128x128">
            <img src={image} />
          </p>
        </figure>
        <div className="media-content">
          <div className="content">
            <div className="buttons">
              <a
                className={`button is-small ${image.includes(coverImage) ? 'is-primary' : ''}`}
                onClick={() => setImageType(image, 'cover')}
              >
                Cover
              </a>
              <a
                className={`button is-small ${image.includes(mainImage) ? 'is-primary' : ''}`}
                onClick={() => setImageType(image, 'image')}
              >
                Main
              </a>
            </div>
          </div>
        </div>
        <div className="media-right">
          <a className="delete" onClick={() => deleteImage(image)}></a>
        </div>
      </article>
    )
  }

  const onClick = (event) => {
    event.preventDefault()
    fileRef.current.click()
  }

  const renderUploadButton = () => {
    return (
      <button className="imageUpload__button" onClick={onClick}>
        Select
      </button>
    )
  }

  return (
    <div className="imageUpload__container">
      <div className="imageUpload__list">{images.map(renderImage)}</div>

      <div className="file is-warning is-boxed">
        <label className="file-label">
          <input
            ref={fileRef}
            className="file-input"
            type="file"
            name="resume"
            onChange={onFileSelected}
            multiple
          />
          <span className="file-cta">
            <span className="file-icon">
              <i className="fas fa-cloud-upload-alt"></i>
            </span>
            <span className="file-label">Select images</span>
          </span>
        </label>
      </div>
    </div>
  )
}

ImageUpload.defaultProps = {
  images: [],
  mainImage: '',
  coverImage: '',
  onChange: () => {},
}

export default ImageUpload
