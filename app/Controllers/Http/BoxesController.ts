import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import BoxRepository from 'App/Repositories/BoxRepository'
import Box from 'App/Models/Box'
import UpdateBoxValidator from 'App/Validators/UpdateBoxValidator'
import VideoRepository from 'App/Repositories/VideoRepository'
import Logger from '@ioc:Adonis/Core/Logger'

export default class BoxesController {
  public async index() {
    return { hello: 'world' }
  }

  public async create({ auth, response }: HttpContextContract) {
    const user = auth.user!

    let box = await BoxRepository.getUncompletedBox(user.id)
    if (!box) {
      box = await Box.create({
        userId: user.id,
        name: 'Untitled',
      })
    }

    return response.redirect().toRoute('boxes.edit', { uid: box.uid })
  }

  public async edit({ request, view, auth }: HttpContextContract) {
    const uid = request.param('uid')
    const user = auth.user!

    const box = await BoxRepository.getUserBoxByBoxUid(user.id, uid)

    const title = 'Edit Box'
    return view.render('box/edit', { title, box })
  }

  public async update({ request, response, auth, session }: HttpContextContract) {
    session.flash('form', {
      name: request.input('name'),
      description: request.input('description'),
    })

    const body = await request.validate<any>(UpdateBoxValidator)

    const uid = request.param('uid')
    const user = auth.user!
    const box = await BoxRepository.getUserBoxByBoxUid(user.id, uid)

    const updateData: any = _.pick(body, ['name', 'description'])
    updateData.isDraft = _.isNil(body.isDraft) ? false : true
    updateData.isPublic = _.isNil(body.isPublic) ? false : true
    console.log(updateData)
    box.merge(updateData)
    await box.save()

    session.flash('success', 'Box updated successfully')
    return response.redirect().toRoute('boxes.edit', { uid: box.uid })
  }

  public async getMyBoxes({ auth, request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 100)

    const user = auth.user!
    const boxes = await BoxRepository.getMyBoxes(user.id, page, limit)

    return response.json(boxes)
  }

  public async addVideoToBoxes({ request, response, auth }: HttpContextContract) {
    const { videoUid, boxUids } = await request.validate({
      schema: schema.create({
        videoUid: schema.string(),
        boxUids: schema.array().members(schema.string()),
      }),
    })
    const user = auth.user!

    const boxes = await BoxRepository.getUserBoxesByBoxUids(user.id, boxUids)
    const video = await VideoRepository.getVideoByUid(videoUid)

    for (const box of boxes) {
      try {
        await box.related('videos').attach([video.id])
      } catch (error) {
        Logger.error('addVideoToBoxes:', error.message)
      }
    }

    return response.status(200).json({
      success: true,
      message: 'Videos added to box',
    })
  }
}
