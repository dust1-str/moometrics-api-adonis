import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'

export default class UsersController {
  async index({ response }: HttpContext) {
    const users = await User.all()

    if (!users) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al obtener los usuarios',
        data: [],
      })
    }
      
    return response.ok({
      status: 'success',
      message: 'Usuarios obtenidos con éxito',
      data: users
    })
  }

  async show({ params, response }: HttpContext) {
    const user = await User.findBy(params.id)
    
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
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)
    const user = await User.create(payload)

    if (!user) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al crear el usuario',
        data: [],
      })
    }

    return response.created({
      status: 'success',
      message: 'Usuario creado con éxito',
      data: user
    })
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateUserValidator)
    const user = await User.findBy(params.id)

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
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.findBy(params.id)

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
  }
}