import React, { useEffect, useState, useCallback } from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import debounce from 'lodash/debounce'

const ReactSearchModal = () => {
  const [keyword, setKeyword] = useState('')
  const [videos, setVideos] = useState([])
  const [casts, setCasts] = useState([])
  const [tags, setTags] = useState([])
  const [hasResults, setHasResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onChange = (e) => {
    setKeyword(e.target.value)
  }

  const onClose = () => {
    document.querySelector('.modal').classList.remove('is-active')
  }

  useEffect(() => {
    if (keyword.length >= 2) {
      setIsLoading(true)
      debounceFetch(keyword?.trim())
    } else {
      setVideos([])
      setCasts([])
      setTags([])
      setHasResults(false)
    }
  }, [keyword])

  const debounceFetch = useCallback(
    debounce((value) => fetchSearchResults(value), 1000),
    []
  )

  const fetchSearchResults = async (value) => {
    const { data } = await axios.post('/api/searches', { keyword: value })
    setVideos(data.videos)
    setCasts(data.casts)
    setTags(data.tags)
    setHasResults(data.videos.length || data.casts.length || data.tags.length)
    setIsLoading(false)
  }

  const renderResults = () => {
    return (
      <div className="panel">
        {videos.length > 0 && (
          <>
            <p className="panel-block is-group px-8">Videos</p>
            {videos.map((video) => (
              <a className="panel-block" href={'/v/' + video.uid}>
                <span className="title with-2-lines">{video.title}</span>
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
              </a>
            ))}
          </>
        )}
        {casts.length > 0 && (
          <>
            <p className="panel-block is-group px-8">Idols</p>
            {casts.map((cast) => (
              <a className="panel-block" href={'/a/' + cast.slug}>
                <span className="title with-2-lines">{cast.name}</span>
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
              </a>
            ))}
          </>
        )}
        {tags.length > 0 && (
          <>
            <p className="panel-block is-group px-8">Genre(s)</p>
            {tags.map((tag) => (
              <a className="panel-block" href={'/tag/' + tag.slug}>
                <span className="title with-2-lines">{tag.name}</span>
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
              </a>
            ))}
          </>
        )}
      </div>
    )
  }

  return (
    <>
      <header className="modal-card-head">
        <div className="field my-0">
          <div className="control has-icons-left has-icons-right">
            <input
              className="input"
              type="text"
              placeholder="Search videos, idols"
              onChange={onChange}
              value={keyword}
            />
            <span className="icon is-small is-left">
              <i className="fa fa-search" aria-hidden="true"></i>
            </span>
            <span className="icon is-small is-right is-hidden-touch is-flex-desktop">ESC</span>
          </div>
        </div>
        <button
          class="delete is-small is-hidden-desktop mr-2"
          aria-label="close"
          onClick={onClose}
        ></button>
      </header>
      <section className="modal-card-body is-flex">
        {keyword.length && !isLoading ? (
          <>
            {hasResults ? (
              renderResults()
            ) : (
              <div className="is-flex is-flex-grow-1 is-justify-content-center is-align-items-center">
                <span className="has-text-centered ">No results for "{keyword}"</span>
              </div>
            )}
          </>
        ) : (
          <div className="is-flex is-flex-grow-1 is-justify-content-center is-align-items-center">
            <span className="has-text-centered ">ABW-225, IPX0177, Aizawa Minami,...</span>
          </div>
        )}
      </section>
      <footer className="modal-card-foot is-flex is-justify-content-flex-end">
        <span className="has-text-weight-light is-text-sm">Ponbook Search</span>
      </footer>
    </>
  )
}

$(function () {
  const root = ReactDOM.createRoot(document.getElementById('search-modal-root'))
  root.render(<ReactSearchModal />)
})
