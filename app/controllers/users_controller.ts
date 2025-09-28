import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  async index({ response }: HttpContext) {
    try {
      const users = await User.query().preload('role')
      return response.ok({
        message: 'Usuarios obtenidos exitosamente',
        data: users
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Error al obtener usuarios',
        error: error.message
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const user = await User.query()
        .where('id', params.id)
        .preload('role')
        .firstOrFail()
      
      return response.ok({
        message: 'Usuario encontrado',
        data: user
      })
    } catch (error) {
      return response.notFound({
        message: 'Usuario no encontrado',
        error: error.message
      })
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const payload = request.only(['name', 'email', 'password', 'roleId'])
      const user = await User.create(payload)
      await user.load('role')
      
      return response.created({
        message: 'Usuario creado exitosamente',
        data: user
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al crear usuario',
        error: error.message
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      const payload = request.only(['name', 'email', 'password', 'roleId'])
      
      user.merge(payload)
      await user.save()
      await user.load('role')
      
      return response.ok({
        message: 'Usuario actualizado exitosamente',
        data: user
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar usuario',
        error: error.message
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()
      
      return response.ok({
        message: 'Usuario eliminado exitosamente'
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al eliminar usuario',
        error: error.message
      })
    }
  }
}