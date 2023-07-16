import uniqid from 'uniqid'

export default function generateUid(prefix?: string) {
  return uniqid(prefix)
}
