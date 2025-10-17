import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import { createChannelValidator, updateChannelValidator } from '#validators/channel'

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

  async show({ params, response }: HttpContext) {
      try {
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
      } catch (error) {
        return response.internalServerError({
          status: 'error',
          message: 'Error al obtener el canal',
          data: error.message
        })
      }
  }

  async store({ request, response, auth }: HttpContext) {
      const payload = await request.validateUsing(createChannelValidator)

      try {
        const user = auth.getUserOrFail()

        if (!user) {
          return response.notFound({
            status: 'error',
            message: 'El usuario que crea el canal no existe',
            data: []
        })
        }
          
        const channel = await Channel.create({
            ...payload,
            createdBy: user.id,
            isActive: true
        })
          
        return response.created({
          status: 'success',
          message: 'Canal creado con éxito',
          data: channel
        })
      } catch (error) {
        return response.internalServerError({
          status: 'error',
          message: 'Error al crear el canal',
          data: error.message
        })
      }
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateChannelValidator)

    try {
      const channel = await Channel.find(params.id)

      if (!channel) {
        return response.notFound({
          status: 'error',
          message: 'Canal no encontrado',
          data: []
        })
      }

      channel.merge(payload)
      await channel.save()

      return response.ok({
        status: 'success',
        message: 'Canal actualizado con éxito',
        data: channel
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al actualizar el canal',
        data: error.message
      })
    }
  }
}