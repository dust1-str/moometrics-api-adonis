import type { HttpContext } from '@adonisjs/core/http'
import Message from '#models/message'
import Channel from '#models/channel'
import { createMessageValidator, updateMessageValidator } from '#validators/message'

export default class MessagesController {
  /**
   * Display messages from a specific channel
   */
  async index({ params, request, response }: HttpContext) {
    try {
      await Channel.query()
        .where('id', params.channelId)
        .where('isActive', true)
        .firstOrFail()
      
      const limit = request.input('limit', 50)
      
      const messages = await Message.query()
        .where('channelId', params.channelId)
        .preload('user', (query) => {
          query.select('id', 'name', 'email')
        })
        .limit(limit)
      
      return response.ok({
        status: 'success',
        message: 'Mensajes obtenidos con éxito',
        data: messages
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          status: 'error',
          message: 'Canal no encontrado',
          data: []
        })
      }
      
      return response.internalServerError({
        status: 'error',
        message: 'Error al obtener los mensajes',
        data: error.message
      })
    }
  }

  /**
   * Send a new message to a channel
   */
  async store({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      console.log(user)
      
      const channel = await Channel.query()
        .where('id', params.channelId)
        .where('isActive', true)
        .firstOrFail()
      
      const payload = await request.validateUsing(createMessageValidator)
      
      const message = await Message.create({
        content: payload.content,
        userId: user.id,
        channelId: channel.id
      })
      
      return response.created({
        status: 'success',
        message: 'Mensaje enviado con éxito',
        data: message
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          status: 'error',
          message: 'Canal no encontrado',
          data: []
        })
      }
      
      return response.internalServerError({
        status: 'error',
        message: 'Error al enviar el mensaje',
        data: error.message
      })
    }
  }

  /**
   * Show a specific message
   */
//   async show({ params, response }: HttpContext) {
//     try {
//       const message = await Message.query()
//         .where('id', params.id)
//         .preload('user', (query) => {
//           query.select('id', 'name', 'email')
//         })
//         .preload('channel', (query) => {
//           query.select('id', 'name')
//         })
//         .firstOrFail()
      
//       return response.ok({
//         status: 'success',
//         message: 'Message retrieved successfully',
//         data: message
//       })
//     } catch (error) {
//       if (error.code === 'E_ROW_NOT_FOUND') {
//         return response.notFound({
//           status: 'error',
//           message: 'Message not found',
//           data: null
//         })
//       }
      
//       return response.internalServerError({
//         status: 'error',
//         message: 'Failed to retrieve message',
//         data: null,
//         error: error.message
//       })
//     }
//   }

  /**
   * Update a message (edit)
   */
//   async update({ auth, params, request, response }: HttpContext) {
//     try {
//       const user = auth.getUserOrFail()
//       const message = await Message.findOrFail(params.id)
      
//       // Check if user owns the message
//       if (message.userId !== user.id) {
//         return response.forbidden({
//           status: 'error',
//           message: 'You are not authorized to edit this message',
//           data: null
//         })
//       }
      
//       const payload = await request.validateUsing(updateMessageValidator)
      
//       message.content = payload.content
//       message.isEdited = true
//       message.editedAt = DateTime.now()
      
//       await message.save()
      
//       await message.load('user', (query) => {
//         query.select('id', 'name', 'email')
//       })
      
//       await message.load('channel', (query) => {
//         query.select('id', 'name')
//       })
      
//       return response.ok({
//         status: 'success',
//         message: 'Message updated successfully',
//         data: message
//       })
//     } catch (error) {
//       if (error.code === 'E_ROW_NOT_FOUND') {
//         return response.notFound({
//           status: 'error',
//           message: 'Message not found',
//           data: null
//         })
//       }
      
//       if (error.code === 'E_VALIDATION_ERROR') {
//         return response.badRequest({
//           status: 'error',
//           message: 'Validation failed',
//           data: null,
//           errors: error.messages
//         })
//       }
      
//       return response.internalServerError({
//         status: 'error',
//         message: 'Failed to update message',
//         data: null,
//         error: error.message
//       })
//     }
//   }

  /**
   * Delete a message
   */
//   async destroy({ auth, params, response }: HttpContext) {
//     try {
//       const user = auth.getUserOrFail()
//       const message = await Message.findOrFail(params.id)
      
//       // Check if user owns the message
//       if (message.userId !== user.id) {
//         return response.forbidden({
//           status: 'error',
//           message: 'You are not authorized to delete this message',
//           data: null
//         })
//       }
      
//       await message.delete()
      
//       return response.ok({
//         status: 'success',
//         message: 'Message deleted successfully',
//         data: null
//       })
//     } catch (error) {
//       if (error.code === 'E_ROW_NOT_FOUND') {
//         return response.notFound({
//           status: 'error',
//           message: 'Message not found',
//           data: null
//         })
//       }
      
//       return response.internalServerError({
//         status: 'error',
//         message: 'Failed to delete message',
//         data: null,
//         error: error.message
//       })
//     }
//   }

  /**
   * Get recent messages from all channels (activity feed)
   */
  async recent({ request, response }: HttpContext) {
    try {
      const limit = request.input('limit', 20)
      
      const messages = await Message.query()
        .preload('user', (query) => {
          query.select('id', 'name', 'email')
        })
        .preload('channel', (query) => {
          query.select('id', 'name').where('isActive', true)
        })
        .whereHas('channel', (query) => {
          query.where('isActive', true)
        })
        .limit(limit)
      
      return response.ok({
        status: 'success',
        message: 'Mensajes recientes obtenidos con éxito',
        data: messages
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al obtener los mensajes recientes',
        data: []
      })
    }
  }
}