import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'

const ReactAddToBoxModal = ({ data: { uid, code } }) => {
  console.log('ReactAddToBoxModal', uid, code)
  const [boxes, setBoxes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selected, setSelected] = useState([])

  const onClose = () => {
    window.closeAddToBoxModal()
  }

  useEffect(() => {
    fetchMyBoxes()
  }, [])

  const fetchMyBoxes = async (value) => {
    const { data } = await axios.get('/api/boxes/my')
    if (Array.isArray(data.data) && data.data.length > 0) {
      setBoxes(data.data)
    }
    setIsLoading(false)
  }

  const onSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await axios.post('/api/boxes/add-video-to-boxes', {
        videoUid: uid,
        boxUids: selected,
      })
      pbToast(response.data.message, 'success')
      onClose()
    } catch (error) {
      setIsSubmitting(false)
      const message = error.response?.data?.message
      pbToast(message || "Couldn't add video to box. Please try again.", 'error')
    }
  }

  const isSelected = (uid) => selected.includes(uid)
  const onSelect = (uid) => {
    if (isSelected(uid)) {
      setSelected(selected.filter((id) => id !== uid))
    } else {
      setSelected([...selected, uid])
    }
  }

  return (
    <>
      <header className="modal-card-head is-active is-flex is-justify-content-space-between">
        <h3 className="is-title">
          Add <strong>{code}</strong> this video to my box
        </h3>
        <span>
          <button className="delete is-small mr-2" aria-label="close" onClick={onClose}></button>
        </span>
      </header>
      <section className="modal-card-body" style={{ minHeight: 300 }}>
        {!isLoading && boxes.length > 0 && (
          <div className="panel">
            {boxes.map((box) => (
              <a key={box.uid} className="panel-block">
                <div className="field">
                  <input
                    className="is-checkradio"
                    id={'box-' + box.uid}
                    type="checkbox"
                    name="exampleCheckbox"
                    checked={isSelected(box.uid)}
                    onChange={() => onSelect(box.uid)}
                  />
                  <label htmlFor={'box-' + box.uid} className="title with-2-lines">
                    {box.name}
                  </label>
                </div>
              </a>
            ))}
          </div>
        )}
        {!isLoading && boxes.length === 0 && (
          <article class="message">
            <div class="message-body">
              You don't have any box yet. <a href="/boxes/create">Create one</a>
            </div>
          </article>
        )}
      </section>
      <footer className="modal-card-foot is-flex is-justify-content-flex-end">
        <button
          className={`button is-small is-primary ${isSubmitting ? 'is-loading' : ''}`}
          disabled={selected.length === 0}
          onClick={onSubmit}
        >
          Save
        </button>
        <a className="button is-small" onClick={onClose}>
          Cancel
        </a>
      </footer>
    </>
  )
}

window.openAddToBoxModal = function (element) {
  const uid = element.getAttribute('data-uid')
  const code = element.getAttribute('data-code')

  const modalRoot = document.getElementById('modal-root')
  const modal = document.createElement('div')
  modal.id = 'add-to-box-modal'
  modalRoot.appendChild(modal)

  const root = ReactDOM.createRoot(modal)
  root.render(
    <div className="modal add-to-box-modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <ReactAddToBoxModal data={{ uid, code }} />
      </div>
    </div>
  )
}

window.closeAddToBoxModal = function () {
  document.getElementById('add-to-box-modal').remove()
}
