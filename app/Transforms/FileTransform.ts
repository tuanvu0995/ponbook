import { CherryPick } from '@ioc:Adonis/Lucid/Orm'

export const FileFields: CherryPick = {
  fields: {
    pick: ['path', 'thumbnail_path', 'height', 'width'],
  },
}

class FileTransform {
  public cherryPick: CherryPick = FileFields
}

export default new FileTransform()
