import InternalServerErrorException from 'App/Exceptions/InternalServerErrorException'
import User from 'App/Models/User'

export default class UserRepository {
  public static async getCommentUser(): Promise<User> {
    const commentUser = await User.query().where('username', 'comment_san').first()
    if (!commentUser) {
      throw new InternalServerErrorException()
    }
    return commentUser
  }
}
