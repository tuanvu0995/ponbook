import _ from 'lodash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VideoRepository from 'App/Repositories/VideoRepository'
import BaseController from './BaseController'

export default class VideoController extends BaseController {
  public name = 'videos'

  constructor() {
    super(new VideoRepository())
  }
}
