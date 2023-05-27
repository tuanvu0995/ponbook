import _ from 'lodash'
import Env from '@ioc:Adonis/Core/Env'
import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'
import Cast from 'App/Models/Cast'
import Tag from 'App/Models/Tag'
import Video from 'App/Models/Video'

async function getVideos() {
  const videos = await Video.query().limit(10)
  return videos.map((video) => {
    return {
      url: `/v/${video.uid}`,
      changefreq: 'monthly',
      priority: 0.1,
    }
  })
}

async function getTags() {
  const tags = await Tag.query().limit(10)
  return tags.map((tag) => {
    return {
      url: `/tag/${tag.slug}`,
      changefreq: 'weekly',
      priority: 0.3,
    }
  })
}

async function getCasts() {
  const casts = await Cast.query().limit(10)
  return casts.map((cast) => {
    return {
      url: `/a/${cast.slug}`,
      changefreq: 'weekly',
      priority: 0.2,
    }
  })
}

const links = [
  { url: '/', changefreq: 'daily', priority: 0.3 },
  { url: '/about', changefreq: 'monthly', priority: 0.1 },
  { url: '/contact', changefreq: 'monthly', priority: 0.1 },
  { url: '/terms', changefreq: 'monthly', priority: 0.1 },
  { url: '/privacy', changefreq: 'monthly', priority: 0.1 },
  { url: '/faq', changefreq: 'monthly', priority: 0.1 },
  { url: '/contact', changefreq: 'monthly', priority: 0.1 },
  { url: '/popular', changefreq: 'monthly', priority: 0.2 },
  { url: '/recent', changefreq: 'daily', priority: 0.3 },
  { url: '/boxes', changefreq: 'daily', priority: 0.2 },
  { url: '/new-release', changefreq: 'daily', priority: 0.2 },
  { url: '/new-comments', changefreq: 'daily', priority: 0.1 },
  { url: '/stars', changefreq: 'daily', priority: 0.1 },
  { url: '/categories', changefreq: 'monthly', priority: 0.3 },
]

export default async function SitemapGenerator() {
  const results = await Promise.all([getVideos(), getTags(), getCasts()])
  const urls = _.flatten([links, ...results])
  const stream = new SitemapStream({ hostname: Env.get('APP_DOMAIN') })

  return streamToPromise(Readable.from(urls).pipe(stream)).then((data) => data.toString())
}
