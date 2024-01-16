export default function slugify(str: string, separator: string = '-'): string {
  return str
    ?.trim()
    ?.toLowerCase()
    ?.replace(/[^a-z0-9]+/g, separator)
}
