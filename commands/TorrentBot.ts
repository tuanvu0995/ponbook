import { BaseCommand } from '@adonisjs/core/build/standalone'
import Torrent from 'App/Models/Torrent'
import Video from 'App/Models/Video'
import delay from 'App/utils/delay'
import axios from 'axios'
import cheerio from 'cheerio'

const sizeUnits = ['KiB', 'MiB', 'GiB']
function humanReadableToMb(size: string) {
  const [value, unit] = size.split(' ')
  const unitIndex = sizeUnits.indexOf(unit)
  return Number(value) * Math.pow(1024, unitIndex)
}

export default class TorrentBot extends BaseCommand {
  public baseUrl = 'https://sukebei.nyaa.si'
  public proxy = {
    protocol: 'http',
    host: '69.243.253.67',
    port: 80,
    // auth: {
    //   username: Env.get('PROXY_USERNAME'),
    //   password: Env.get('PROXY_PASSWORD'),
    // },
  }

  public options = {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36',
    },
    // proxy: this.proxy,
  }

  /**
   * Command name is used to run the command
   */
  public static commandName = 'torrent:bot'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async getTorrent(url: string): Promise<any> {
    const response = await axios.get(this.baseUrl + url, this.options)
    const $ = cheerio.load(response.data)

    const torrentFilePath = $('.panel-footer.clearfix').find('a').eq(0).attr('href')
    const magnetUrl = $('a.card-footer-item').attr('href')!
    const panelRows = $('.panel-body').children().toArray()
    const seederRow = panelRows[1]
    const leecherRow = panelRows[2]
    const sizeRow = panelRows[3]
    const infoHashRow = panelRows[4]

    const seed = $(seederRow).find('.col-md-5 span').text()
    if (seed === '0') return null
    const leech = $(leecherRow).find('.col-md-5 span').text()
    const size = $($(sizeRow).children().toArray()[1]).text()
    const infoHash = $(infoHashRow).find('kbd').text()
    const torrent = {
      magnetUrl,
      seed,
      leech,
      size: humanReadableToMb(size),
      infoHash,
      name: '',
      torrentFile: this.baseUrl + torrentFilePath,
    }

    const torrentFileList = $('.torrent-file-list > ul > li').toArray()
    for (const torrentFile of torrentFileList) {
      const aFolder = $(torrentFile).find('a.folder').toArray()
      if (aFolder.length === 0) {
        torrent.name = $(torrentFile).text()
        continue
      }
      const files = $(torrentFile).find('ul > li').toArray()
      const fileWithSizes = files.map((f) => {
        const fileSize = $(f).find('span').text().replace('(', '').replace(')', '')
        return {
          name: $(f).text(),
          size: humanReadableToMb(fileSize),
        }
      })

      // sort by size
      fileWithSizes.sort((a, b) => b.size - a.size)

      torrent.name = fileWithSizes[0].name
    }
    return torrent
  }

  public async search(video: Video) {
    const response = await axios.get(`${this.baseUrl}/?f=0&c=0_0&q=${video.code}`, this.options)
    const $ = cheerio.load(response.data)

    const rows = $('tr.default').toArray()
    for (const row of rows) {
      // get td 2nd
      const td = $(row).find('td').eq(1)
      const a = $(td).find('a')
      const url = a.attr('href')!
      const torrentData = await this.getTorrent(url)
      if (!torrentData) continue
      await Torrent.create({
        videoId: video.id,
        name: torrentData.name,
        magnetUrl: torrentData.magnetUrl,
        torrentFile: torrentData.torrentFile,
        seed: torrentData.seed,
        leech: torrentData.leech,
        completed: 0,
        infoHash: torrentData.infoHash,
        size: torrentData.size,
      })
      await delay(1000)
    }
  }

  public async run() {
    const { default: Video } = await import('App/Models/Video')
    let isEnded = false

    while (!isEnded) {
      try {
        const video = await Video.query()
          .where('is_deleted', false)
          .where('has_torrent', false)
          .orderBy('release_date', 'desc')
          .first()
        if (!video) {
          isEnded = true
          return
        }

        await this.search(video)
        video.hasTorrent = true
        await video.save()
        console.log('Complete search torrent for ', video.code)
        await delay(1000)
      } catch (error) {
        console.log(`Error when search torrent: `, error)
      }
    }
  }
}
