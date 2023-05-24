export default function getToggleAjaxHandler(element) {
  const toggleIconOn = element.dataset.toggleIconOn?.split(' ')
  const toggleIconOff = element.dataset.toggleIconOff?.split(' ')
  //   const canToggleIcon = toggleIconOn?.length && toggleIconOff?.length

  let icon = element.querySelector('i')
  return function toggleIcon(state) {
    if (state) {
      icon.classList.remove(...toggleIconOff)
      icon.classList.add(...toggleIconOn)
    } else {
      icon.classList.remove(...toggleIconOn)
      icon.classList.add(...toggleIconOff)
    }
  }
}
