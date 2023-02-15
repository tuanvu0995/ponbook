import sharp from 'sharp'
import fs from 'fs'

export default async function SimpleWImg(imagePath: string, newFileName: string) {
  const data = await sharp(imagePath).webp().toBuffer()
  fs.writeFileSync(newFileName, data, 'binary')
  fs.unlinkSync(imagePath)
}
