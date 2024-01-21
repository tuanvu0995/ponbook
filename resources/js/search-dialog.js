import { customFetch } from './utils/customFetch'
import { debounce } from './utils/debounce'
export function initSearchDialog() {
  var searchDialogMessage = document.getElementById('search-dialog-message')
  var searchDialogBody = document.getElementById('search-dialog-body')

  const fetchSearchResults = async (value) => {
    const data = await customFetch('/api/search/suggestions', {
      method: 'POST',
      body: JSON.stringify({ keyword: value }),
    })

    if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
      searchDialogMessage.classList.add('is-hidden')
      searchDialogBody.innerHTML = ''
      data.suggestions.forEach((suggestion) => {
        var a = document.createElement('a')
        a.classList.add('panel-block')
        a.setAttribute('href', '/search?term=' + suggestion.term)
        a.innerHTML = suggestion.term
        searchDialogBody.appendChild(a)
      })
    } else {
      searchDialogMessage.classList.add('is-flex')
    }
  }

  function closeSearchDialog() {
    var dialog = document.getElementById('search-dialog')
    if (!dialog) return

    dialog.classList.remove('is-active')
  }

  function openSearchDialog() {
    var dialog = document.getElementById('search-dialog')
    if (!dialog) return

    dialog.classList.add('is-active')

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeSearchDialog()
      }
    })

    var input = document.getElementById('search-input')
    if (!input) return

    input.focus()

    var debouncedFetchSearchResults = debounce(fetchSearchResults, 300)

    input.addEventListener('input', function (event) {
      if (event.target.value) {
        debouncedFetchSearchResults(event.target.value)
      }
    })

    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        var keyword = input.value
        if (!keyword) return
        window.location.href = '/search?term=' + keyword
      }
    })
  }
  window.openSearchDialog = openSearchDialog
  window.closeSearchDialog = closeSearchDialog
}
