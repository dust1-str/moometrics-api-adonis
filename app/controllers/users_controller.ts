import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'

export default class UsersController {
  async index({ response }: HttpContext) {
    try {
      const users = await User.all()

      return response.ok({
        status: 'success',
        message: 'Usuarios obtenidos con éxito',
        data: users
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al obtener los usuarios',
        data: error.message
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const user = await User.find(params.id)

      if (!user) {
        return response.notFound({
          status: 'error',
          message: 'Usuario no encontrado',
          data: []
        })
      }

      return response.ok({
        status: 'success',
        message: 'Usuario obtenido con éxito',
        data: user
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al obtener el usuario',
        data: error.message
      })
    }
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)

    try {
        const user = await User.create(payload)
        return response.created({
          status: 'success',
          message: 'Usuario creado con éxito',
          data: user
        })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al crear el usuario',
        data: error.message
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateUserValidator)

    try {
      const user = await User.find(params.id)

      if (!user) {
        return response.notFound({
          status: 'error',
          message: 'Usuario no encontrado',
          data: []
        })
      }

      user.merge(payload)
      await user.save()

      return response.ok({
        status: 'success',
        message: 'Usuario actualizado con éxito',
        data: user
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al actualizar el usuario',
        data: error.message
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const user = await User.find(params.id)

      if (!user) {
        return response.notFound({
          status: 'error',
          message: 'Usuario no encontrado',
          data: []
        })
      }

      await user.delete()
      
      return response.ok({
        status: 'success',
        message: 'Usuario eliminado con éxito',
        data: []
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al eliminar el usuario',
        data: error.message
      })
    }
  }
}