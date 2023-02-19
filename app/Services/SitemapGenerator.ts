import Env from '@ioc:Adonis/Core/Env'
import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'
import Cast from 'App/Models/Cast'
import Tag from 'App/Models/Tag'
import Video from 'App/Models/Video'

async function getVideos() {
  const videos = await Video.all()
  return videos.map((video) => {
    return {
      url: `/v/${video.uid}`,
      changefreq: 'monthly',
      priority: 0.1,
    }
  })
}

async function getTags() {
  const tags = await Tag.all()
  return tags.map((tag) => {
    return {
      url: `/tag/${tag.slug}`,
      changefreq: 'weekly',
      priority: 0.3,
    }
  })
}

async function getCasts() {
  const casts = await Cast.all()
  return casts.map((cast) => {
    return {
      url: `/cast/${cast.uid}`,
      changefreq: 'weekly',
      priority: 0.2,
    }
  })
}

export default async function SitemapGenerator() {
  const results = await Promise.all([getVideos(), getTags(), getCasts()])
  const urls = results.flat()
  const stream = new SitemapStream({ hostname: Env.get('APP_DOMAIN') })

  return streamToPromise(Readable.from(urls).pipe(stream)).then((data) => data.toString())
}
