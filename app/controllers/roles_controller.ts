import type { HttpContext } from '@adonisjs/core/http'
import Role from '#models/role'
import { createRoleValidator, updateRoleValidator } from '#validators/role'

export default class RolesController {
  async index({ response }: HttpContext) {
    try {
      const roles = await Role.all()

      return response.ok({
        status: 'success',
        message: 'Roles obtenidos con éxito',
        data: roles
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al obtener los roles',
        data: error.message
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
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
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al obtener el rol',
        data: error.message
      })
    }
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createRoleValidator)

    try {
      const role = await Role.create(payload)
      return response.created({
        status: 'success',
        message: 'Rol creado con éxito',
        data: role
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al crear el rol',
        data: error.message
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateRoleValidator)

    try {
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
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al actualizar el rol',
        data: error.message
      })
    }

    
  }

  async destroy({ params, response }: HttpContext) {
    try {
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
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al eliminar el rol',
        data: error.message
      })
    }
  }
}