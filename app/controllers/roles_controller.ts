import type { HttpContext } from '@adonisjs/core/http'
import Role from '#models/role'
import { createRoleValidator, updateRoleValidator } from '#validators/role'

export default class RolesController {
  async index({ response }: HttpContext) {
    const roles = await Role.all()

    if (!roles) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al obtener los roles',
        data: [],
      })
    }

    return response.ok({
      status: 'success',
      message: 'Roles obtenidos con éxito',
      data: roles
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createRoleValidator)
    const role = await Role.create(payload)

    if (!role) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al crear el rol',
        data: [],
    })
  }

    return response.created({
      status: 'success',
      message: 'Rol creado con éxito',
      data: role
    })
  }

  async show({ params, response }: HttpContext) {
    const role = await Role.find(params.id)

    if (!role) {
      return response.notFound({
        status: 'error',
        message: 'Rol no encontrado',
        data: []
      })
    }

    return response.ok({
      status: 'success',
      message: 'Rol obtenido con éxito',
      data: role
    })
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateRoleValidator)
    const role = await Role.find(params.id)

    if (!role) {
      return response.notFound({
        status: 'error',
        message: 'Rol no encontrado',
        data: []
      })
    }

    role.merge(payload)
    await role.save()

    return response.ok({
      status: 'success',
      message: 'Rol actualizado con éxito',
      data: role
    })
  }

  async destroy({ params, response }: HttpContext) {
    const role = await Role.find(params.id)

    if (!role) {
      return response.notFound({
        status: 'error',
        message: 'Rol no encontrado',
        data: []
      })
    }

    await role.delete()

    return response.ok({
      status: 'success',
      message: 'Rol eliminado con éxito',
      data: []
    })
  }
}