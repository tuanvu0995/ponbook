const girlXyzUrl =
  'https://www.liquidfire.mobi/redirect?sl=16&t=dr&track=185704_286256&siteid=286256'

export default function initAds() {
  const banner = document.getElementById('girlxyz-banner')
  if (banner) {
    banner.addEventListener('click', function (event) {
      event.stopPropagation()
      window.open(girlXyzUrl, '_blank')
    })
  }
}
