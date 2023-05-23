import InternalServerErrorException from 'App/Exceptions/InternalServerErrorException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import User from 'App/Models/User'

export default class UserRepository {
  public static async getCommentUser(): Promise<User> {
    const commentUser = await User.query().where('username', 'comment_san').first()
    if (!commentUser) {
      throw new InternalServerErrorException()
    }
    return commentUser
  }

  public static async findByUid(uid: string): Promise<User> {
    const user = await User.query().where('uid', uid).where('is_deleted', false).first()
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }
}
