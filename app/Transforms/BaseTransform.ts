import _ from 'lodash'
import { CherryPick, LucidRow, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

export abstract class BaseTransform {
  public abstract cherryPick: CherryPick

  public transform(data: LucidRow | ModelPaginatorContract<LucidRow> | LucidRow[]) {
    if (_.isArray(data)) {
      console.log(this.cherryPick)
      return data.map((item) => item.serialize(this.cherryPick))
    }
    return data.serialize(this.cherryPick)
  }
}
