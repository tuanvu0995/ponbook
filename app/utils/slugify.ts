import Slugify from 'slugify'

export default function slugify(str: string): string {
  return Slugify(str, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    locale: 'en',
    trim: true,
  })
}
