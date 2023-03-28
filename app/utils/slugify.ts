export default function slugify(str: string): string {
  return str
    ?.trim()
    ?.toLowerCase()
    ?.replace(/[^a-z0-9]+/g, '-')
}
