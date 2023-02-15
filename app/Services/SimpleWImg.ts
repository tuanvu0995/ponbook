import sharp from 'sharp'
import fs from 'fs'

export default async function SimpleWImg(imagePath: string): Promise<string> {
  const data = await sharp(imagePath).webp().toBuffer()
  let dist = imagePath.split('.').slice(0, -1).join('.') + '.webp'
  fs.writeFileSync(dist, data, 'binary')
  fs.unlinkSync(imagePath)
  return dist
}
