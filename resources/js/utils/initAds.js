const girlXyzUrl =
  'https://go.xlirdr.com?userId=81bf055de32f51a4ed8de64280fdd8e4a5170fd0f6150df2c7ce2da1660a0693'

export default function initAds() {
  const banner = document.getElementById('stripchat-banner')
  if (banner) {
    banner.addEventListener('click', function (event) {
      event.stopPropagation()
      window.open(girlXyzUrl, '_blank')
    })
  }
}
