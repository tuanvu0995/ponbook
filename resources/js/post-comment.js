var options = {
  debug: 'info',
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'blockquote', 'code-block'],
    ],
  },
  placeholder: 'Enter your comment...',
  theme: 'snow',
}

$(function () {
  const replyButtons = document.querySelectorAll('.reply-comment-button')

  replyButtons.forEach(function (el) {
    el.classList.add('is-working')
    el.addEventListener('click', function (event) {
      event.stopPropagation()
      showReplyForm(el)
    })
  })
})

function showReplyForm(element) {
  const uid = element.dataset.uid
  const commentBox = document.querySelector('#comment-' + uid)
  commentBox.classList.toggle('is-hidden')
  var editor = new Quill('#comment-editor-' + uid, options)
  // quillImageHandler(editor, { postId: {{ post.id }} })

  const textarea = commentBox.getElementsByTagName('textarea')[0]

  editor.on('text-change', function (delta, oldDelta, source) {
    textarea.value = editor.root.innerHTML
  })
}
