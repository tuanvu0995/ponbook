import { createPopper } from '@popperjs/core'

export default function createPopover(parentElement, content, options = {}) {
  const tooltip = document.createElement('div')
  tooltip.setAttribute('id', 'tooltip')
  tooltip.setAttribute('role', 'tooltip')
  tooltip.setAttribute('class', 'is-tooltip')
  tooltip.innerHTML = content

  const arrow = document.createElement('div')
  arrow.setAttribute('data-popper-arrow', '')
  arrow.setAttribute('class', 'is-tooltip-arrow')
  tooltip.appendChild(arrow)

  parentElement.appendChild(tooltip)

  createPopper(parentElement, tooltip, {
    placement: 'bottom',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  })

  if (options.timeout) {
    const cleaner = setTimeout(() => {
      tooltip.remove()
      clearTimeout(cleaner)
    }, options.timeout)
  }
}
