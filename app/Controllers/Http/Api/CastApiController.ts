import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CastRepo } from 'App/Repos/CastRepo'
import { FavoriteStatus } from 'App/common/types'

export default class CastApiController {
  public async favorite({ request, response, auth }: HttpContextContract) {
    const uid = request.param('uid')
    const cast = await CastRepo.findByUid(uid)

    if (!cast) {
      return response.notFound({
        errors: [{ message: 'Cast not found' }],
      })
    }

    const user = auth.user!
    let state: FavoriteStatus = 'added'

    if (await user.related('casts').query().where('cast_id', cast.id).first()) {
      await user.related('casts').detach([cast.id])
      state = 'removed'
    } else {
      await user.related('casts').attach([cast.id])
    }

    return response.json({
      success: true,
      state,
      message: `${cast.name} ${state} ${state === 'added' ? 'to' : 'from'} your favorites`,
    })
  }
}
