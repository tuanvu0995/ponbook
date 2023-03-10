const CATEGORIES = [
  'girl',
  'hot_flirt',
  'soul_mate',
  'mature',
  'fetish',
  'boy',
  'gay',
  'transgender',
  'lesbian',
  'couple',
  'freemium',
]

class LiveCamAds {
  private baseUrl: string = 'https://wmpuem.com/pu'

  public target: string = 'fslf'
  public site: string = 'jasmin'
  public psid: string = 'vulai2022'
  public pstool: string = '300_18'
  public psprogram: string = 'revs'
  public campaign_id: string = ''
  public category: string = 'girl'
  public filters: string[] = ['teen']
  public fixedString: 'forcedPerformers[]=&vp[showChat]=true&vp[chatAutoHide]=true&vp[showCallToAction]=false&vp[showPerformerName]=true&vp[showPerformerStatus]=true&ms_notrack=1&subAffId={SUBAFFID}'

  public withCategory(category: string): LiveCamAds {
    this.category = category
    return this
  }

  public getLiveCamAdsUrl(): string {
    const paramsString = new URLSearchParams(this.params).toString()
    return this.baseUrl + '?' + paramsString + '&' + this.fixedString
  }

  public get params(): any {
    return {
      target: this.target,
      site: this.site,
      psid: this.psid,
      pstool: this.pstool,
      psprogram: this.psprogram,
      campaign_id: this.campaign_id,
      filters: this.filters.join('+'),
    }
  }
}

export default new LiveCamAds()
