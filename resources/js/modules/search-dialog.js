import React, { useEffect, useState, useCallback } from 'react'
import ReactDOM from 'react-dom/client'
import debounce from 'lodash/debounce'
import { customFetch } from './utils/customFetch'

const ReactSearchDialog = () => {
  const [keyword, setKeyword] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = React.createRef()

  const onChange = (e) => {
    setKeyword(e.target.value)
  }

  const onClose = () => {
    window.closeSearchDialog()
  }

  useEffect(() => {
    feather.replace()

    const handleEsc = (e) => {
      if (e.keyCode === 27) onClose()
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  useEffect(() => {
    if (inputRef) {
      inputRef.current.focus()
    }
  }, [inputRef.current])

  useEffect(() => {
    if (keyword.length >= 2) {
      setIsLoading(true)
      debounceFetch(keyword?.trim())
    } else {
      setSuggestions([])
    }
  }, [keyword])

  const debounceFetch = useCallback(
    debounce((value) => fetchSearchResults(value), 200),
    []
  )

  const fetchSearchResults = async (value) => {
    const data = await customFetch('/api/search/suggestions', {
      method: 'POST',
      body: JSON.stringify({ keyword: value }),
    })
    setSuggestions(data.suggestions)
    setIsLoading(false)
  }

  const renderResults = () => {
    return (
      <div className="panel">
        {suggestions.length > 0 && (
          <>
            {suggestions.map((suggestion) => (
              <a className="panel-block" href={`/search?term=${suggestion.term}`}>
                <span className="title with-2-lines">{suggestion.term}</span>
                <i className="fa fa-chevron-right" aria-hidden="true"></i>
              </a>
            ))}
          </>
        )}
      </div>
    )
  }

  const onKeyDown = (e) => {
    if (e.keyCode === 13 && keyword.length > 0) {
      window.location.href = `/search?term=${keyword}`
    }
  }

  return (
    <>
      <header className="modal-card-head is-active">
        <div className="field my-0">
          <div className="control has-icons-left has-icons-right">
            <input
              ref={inputRef}
              className="input"
              type="text"
              placeholder="Search..."
              onChange={onChange}
              onKeyDown={onKeyDown}
              value={keyword}
            />
            <span className="icon is-small is-left">
              <i data-feather="search"></i>
            </span>
            <span
              className="icon is-small is-right is-hidden-touch is-flex-desktop"
              onClick={onClose}
            >
              ESC
            </span>
          </div>
        </div>
        <a
          role="button"
          class="navbar-burger is-active"
          aria-label="menu"
          aria-expanded="false"
          onClick={onClose}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </header>
      <section className="modal-card-body is-flex">
        {keyword.length && !isLoading ? (
          <>
            {suggestions.length > 0 ? (
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

window.openSearchDialog = function () {
  const modalRoot = document.getElementById('modal-root')
  const modal = document.createElement('div')
  modal.id = 'search-dialog-content'
  modalRoot.appendChild(modal)

  const root = ReactDOM.createRoot(modal)
  root.render(
    <div id="search-modal" className="modal search-modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <ReactSearchDialog />
      </div>
    </div>
  )
}

window.closeSearchDialog = function () {
  document.getElementById('search-modal')?.remove()
}
