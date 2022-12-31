import Env from '@ioc:Adonis/Core/Env'
import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'
import Cast from 'App/Models/Cast'
import Tag from 'App/Models/Tag'
import Video from 'App/Models/Video'
import { Ioc } from '@adonisjs/core/build/standalone'

async function getVideos() {
  const videos = await Video.all()
  return videos.map((video) => {
    return {
      url: `/videos/${video.uid}`,
      changefreq: 'daily',
      priority: 0.3,
    }
  })
}

async function getTags() {
  const tags = await Tag.all()
  return tags.map((tag) => {
    return {
      url: `/tags/${tag.slug}`,
      changefreq: 'daily',
      priority: 0.3,
    }
  })
}

async function getCasts() {
  const casts = await Cast.all()
  return casts.map((cast) => {
    return {
      url: `/casts/${cast.uid}`,
      changefreq: 'daily',
      priority: 0.3,
    }
  })
}

export default async function SitemapGenerator() {
  const results = await Promise.all([getVideos(), getTags(), getCasts()])
  const urls = results.flat()
  console.log(urls)
  const stream = new SitemapStream({ hostname: Env.get('APP_DOMAIN') })

  return streamToPromise(Readable.from(urls).pipe(stream)).then((data) => data.toString())
}
