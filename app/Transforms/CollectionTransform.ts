import Collection from 'App/Models/Collection'

export default class CollectionTransform {
  public static async transform(collection: Collection) {
    return collection.serialize({
      fields: {
        pick: ['name', 'slug', 'description'],
      },
      relations: {
        videos: {
          fields: {
            pick: [
              'uid',
              'code',
              'title',
              'description',
              'cover',
              'image',
              'release_date',
              'duration',
              'rate',
              'rate_count',
              'view_count',
              'comment_count',
            ],
          },
          relations: {
            videoCover: {
              fields: {
                pick: ['path', 'thumbnail_path', 'width', 'height'],
              },
            },
          },
        },
      },
    })
  }
}
