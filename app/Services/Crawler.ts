import Drive from '@ioc:Adonis/Core/Drive'
import Cast from 'App/Models/Cast'
import Director from 'App/Models/Director'
import Maker from 'App/Models/Maker'
import Tag from 'App/Models/Tag'
import Video from 'App/Models/Video'
import slugify from 'App/utils/slugify'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { nanoid } from 'nanoid'
import DownloadFile from './DownloadFile'

export default class Crawler {
  constructor() {}

  public async crawl(url: string) {
    const rsp = await axios.get(url, {
      headers: { 'Accept-Encoding': 'gzip,deflate,compress', 'User-Agent': 'Axios 1.2.1' },
    })

    const $ = cheerio.load(rsp.data)

    const title = $('#video_title > h3 > a').text()

    const imageUrl = $('#video_jacket_img').attr('src')

    const videoID = $('#video_id td.text').text().trim()
    const videoDate = $('#video_date td.text').text().trim()
    const videoDuration = $('#video_length span.text').text().trim()
    const videoDirector = $('#video_director td.text').text().trim()
    const videoMaker = $('#video_maker td.text').text().trim()

    const castElements = $('#video_cast span.cast span.star a')
    const casts: any[] = []
    castElements.each((_, el) => {
      casts.push(el)
    })

    const videoCasts = casts.map((el) => $(el).text().trim())

    const genresElements = $('#video_genres span.genre')
    const elements: any[] = []
    genresElements.each((_, el) => {
      elements.push(el)
    })
    const genres = elements.map((el) => $(el).text().trim())

    return {
      title,
      code: videoID,
      releaseDate: videoDate,
      duration: videoDuration,
      director: videoDirector,
      maker: videoMaker,
      casts: videoCasts,
      genres,
      imageUrl,
    }
  }

  public async addVideo(videoData: any) {
    const existsVideo = await Video.query().where('code', videoData.code.trim()).first()
    if (existsVideo) return existsVideo

    const video = new Video()
    video.code = videoData.code.trim()
    video.title = videoData.title.trim()
    video.description = videoData.title.replace(videoData.code, '').trim()
    video.duration = Number(videoData.duration.trim())
    video.releaseDate = videoData.releaseDate.trim()
    video.userId = 1
    await video.save()

    if (videoData.director) {
      let director = await Director.query().where('name', videoData.director).first()
      if (!director) {
        director = new Director()
        director.name = videoData.director
        await director.save()
      }
      video.directorId = director.id
    }

    if (videoData.maker) {
      let maker = await Maker.query().where('name', videoData.maker).first()
      if (!maker) {
        maker = new Maker()
        maker.name = videoData.maker
        await maker.save()
      }
      video.makerId = maker.id
    }

    if (videoData.casts) {
      for (const castName of videoData.casts) {
        let cast = await Cast.query().where('name', castName).first()
        if (!cast) {
          cast = new Cast()
          cast.name = castName
          await cast.save()
        }
        await video.related('casts').attach([cast.id])
      }
    }

    if (Array.isArray(videoData.genres)) {
      for (const genre of videoData.genres) {
        const existsTag = await Tag.query().where('name', genre).first()
        if (existsTag) {
          await video.related('tags').attach([existsTag.id])
          continue
        }
        const newTag = new Tag()
        newTag.name = genre.trim()
        newTag.slug = genre
          .trim()
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, '')
        await newTag.save()
        await video.related('tags').attach([genre.id])
      }
    }

    video.slug = slugify(video.title)

    const data = await DownloadFile('http:' + videoData.imageUrl)
    const filename = `images/${video.slug}-${nanoid()}.jpg`
    await Drive.put(filename, data)
    console.log('Uploaded image', filename)
    video.image = filename

    const images = JSON.parse(video.images || '[]')
    images.push(filename)
    video.images = JSON.stringify(images)

    await video.save()

    return video
  }
}
