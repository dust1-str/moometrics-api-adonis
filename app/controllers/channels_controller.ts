import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import { createChannelValidator } from '#validators/channel'
import User from '#models/user'

export default class ChannelsController {
  async index({ response }: HttpContext) {
    try {
      const channels = await Channel.query()
        .where('isActive', true)
        .preload('creator', (query) => {
          query.select('id', 'name', 'email')
        })
        .withCount('messages')
      
      return response.ok({
        status: 'success',
        message: 'Canales obtenidos con éxito',
        data: channels
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al obtener los canales',
        data: []
      })
    }
  }

async store({ request, params, response }: HttpContext) {
    const payload = await request.validateUsing(createChannelValidator)
    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({
        status: 'error',
        message: 'El usuario que crea el canal no existe',
        data: []
     })
  }
      
    const channel = await Channel.create({
        ...payload,
        createdBy: user.id
    })
      
      await channel.load('creator', (query) => {
        query.select('id', 'name', 'email')
      })
      
      return response.created({
        status: 'success',
        message: 'Canal creado con éxito',
        data: channel
      })
  }

  async show({ params, response }: HttpContext) {
    const channel = await Channel.find(params.id)

    if (!channel) {
      return response.notFound({
        status: 'error',
        message: 'Canal no encontrado',
        data: []
      })
    }

    return response.ok({
      status: 'success',
      message: 'Canal obtenido con éxito',
      data: channel
    })
  }
}