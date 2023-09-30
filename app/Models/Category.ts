import {
  BelongsTo,
  HasMany,
  ManyToMany,
  afterSave,
  belongsTo,
  column,
  hasMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Event from '@ioc:Adonis/Core/Event'
import AppBaseModel from './AppBaseModel'
import Video from './Video'

export type CalculationMethod = 'manual' | 'automatic'

export type FilterData = {
  tags: []
  keywords: []
}

export type Breadcrumb = {
  slug: string
  name: string
}

export default class Category extends AppBaseModel {
  @column()
  public parentId: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public description: string

  @column()
  public calculationMethod: CalculationMethod

  @column()
  public filters: FilterData

  @column({
    prepare: (value) => {
      console.log(value)
      return value ? JSON.stringify(value) : []
    },
  })
  public breadcrumbs: Breadcrumb[]

  @manyToMany(() => Video, {
    pivotTable: 'category_videos',
  })
  public videos: ManyToMany<typeof Video>

  @belongsTo(() => Category, {
    foreignKey: 'parentId',
  })
  public parent: BelongsTo<typeof Category>

  @hasMany(() => Category, {
    foreignKey: 'parentId',
  })
  public children: HasMany<typeof Category>

  @afterSave()
  public static async calculate(category: Category) {
    if (category.calculationMethod !== 'automatic') return
    if (!category.filters) return
    if (category.filters === category.$original.filters) return

    Event.emit('category:calculate', category)
  }

}
