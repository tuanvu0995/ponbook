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
  tooltip.style.display = 'none'

  parentElement.appendChild(tooltip)

  const popperInstance = createPopper(parentElement, tooltip, {
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

  const showEvents = ['mouseenter', 'focus']
  const hideEvents = ['mouseleave', 'blur']

  showEvents.forEach((event) => {
    parentElement.addEventListener(event, () => {
      tooltip.style.display = 'block'
      popperInstance.update()
    })
  })

  hideEvents.forEach((event) => {
    parentElement.addEventListener(event, () => {
      tooltip.style.display = 'none'
      popperInstance.update()
    })
  })

  if (options.timeout) {
    const cleaner = setTimeout(() => {
      tooltip.remove()
      clearTimeout(cleaner)
    }, options.timeout)
  }
}
