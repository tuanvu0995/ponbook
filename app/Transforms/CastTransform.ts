import { CherryPick } from '@ioc:Adonis/Lucid/Orm'

export const CastFields: CherryPick = {
  fields: {
    pick: ['id', 'name', 'slug'],
  },
}

class CastTransform {
  public cherryPick: CherryPick = CastFields
}

export default new CastTransform()
