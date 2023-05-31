import _ from 'lodash'
import Box from 'App/Models/Box'
import NotFoundException from 'App/Exceptions/NotFoundException'

export default class BoxRepository {
  public static async getBoxByUid(uid: string): Promise<Box> {
    const box = await Box.query()
      .where('uid', uid)
      .where('is_deleted', false)
      .where('is_public', true)
      .first()
    if (_.isNil(box)) {
      throw new NotFoundException('Box not found')
    }
    return box
  }

  public static async getUserBoxByBoxUid(userId: number, uid: string): Promise<Box> {
    const box = await Box.query()
      .where('user_id', userId)
      .where('uid', uid)
      .where('is_deleted', false)
      .first()
    if (_.isNil(box)) {
      throw new NotFoundException('Box not found')
    }
    return box
  }

  public static async getUserBoxesByBoxUids(userId: number, uids: string[]): Promise<Box[]> {
    const boxes = await Box.query()
      .where('user_id', userId)
      .whereIn('uid', uids)
      .where('is_deleted', false)
    return boxes
  }

  public static async getUncompletedBox(userId: number): Promise<Box | null> {
    return await Box.query()
      .where('user_id', userId)
      .where('is_deleted', false)
      .where('is_draft', true)
      .first()
  }

  public static async getBoxes(page: number = 1, limit: number = 10) {
    const boxes = await Box.query()
      .preload('user')
      .preload('videos', (query) =>
        query.preload('videoCover').orderBy('box_videos.id', 'desc').limit(6)
      )
      .has('videos')
      .where('is_deleted', false)
      .where('is_public', true)
      .orderBy('view_count', 'desc')
      .paginate(page, limit)

    for (const box of boxes) {
      await box.load('videos', (query) =>
        query.preload('videoCover').orderBy('id', 'desc').limit(6)
      )
    }

    return boxes
  }

  public static async getMyBoxes(userId: number, page: number = 1, limit: number = 10) {
    return await Box.query()
      .preload('videos', (query) => query.limit(5))
      .where('user_id', userId)
      .where('is_deleted', false)
      .where('is_public', true)
      .orderBy('id', 'desc')
      .paginate(page, limit)
  }

  public static async getTop3Boxes() {
    return this.getBoxes(1, 3)
  }
}
