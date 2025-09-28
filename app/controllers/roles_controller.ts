import type { HttpContext } from '@adonisjs/core/http'
import Role from '#models/role'
import { createRoleValidator, updateRoleValidator } from '#validators/role'

export default class RolesController {
  /**
   * Display a list of all roles
   */
  async index({ response }: HttpContext) {
    try {
      const roles = await Role.query().preload('users')
      
      return response.ok({
        message: 'Roles retrieved successfully',
        data: roles
      })
    } catch (error) {
      return response.internalServerError({
        message: 'Failed to retrieve roles',
        error: error.message
      })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createRoleValidator)
      
      const role = await Role.create(payload)
      
      return response.created({
        message: 'Role created successfully',
        data: role
      })
    } catch (error) {
      if (error.code === 'E_VALIDATION_ERROR') {
        return response.badRequest({
          message: 'Validation failed',
          errors: error.messages
        })
      }
      
      return response.internalServerError({
        message: 'Failed to create role',
        error: error.message
      })
    }
  }

  /**
   * Show individual role
   */
  async show({ params, response }: HttpContext) {
    try {
      const role = await Role.query()
        .where('id', params.id)
        .preload('users')
        .firstOrFail()
      
      return response.ok({
        message: 'Role retrieved successfully',
        data: role
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'Role not found'
        })
      }
      
      return response.internalServerError({
        message: 'Failed to retrieve role',
        error: error.message
      })
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const role = await Role.findOrFail(params.id)
      
      const payload = await request.validateUsing(updateRoleValidator)
      
      role.merge(payload)
      await role.save()
      
      return response.ok({
        message: 'Role updated successfully',
        data: role
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'Role not found'
        })
      }
      
      if (error.code === 'E_VALIDATION_ERROR') {
        return response.badRequest({
          message: 'Validation failed',
          errors: error.messages
        })
      }
      
      return response.internalServerError({
        message: 'Failed to update role',
        error: error.message
      })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const role = await Role.findOrFail(params.id)
      
      // Check if role has users assigned
      await role.load('users')
      
      if (role.users.length > 0) {
        return response.badRequest({
          message: 'Cannot delete role with assigned users',
          data: {
            usersCount: role.users.length
          }
        })
      }
      
      await role.delete()
      
      return response.ok({
        message: 'Role deleted successfully'
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'Role not found'
        })
      }
      
      return response.internalServerError({
        message: 'Failed to delete role',
        error: error.message
      })
    }
  }

  /**
   * Get all users assigned to a specific role
   */
  async users({ params, response }: HttpContext) {
    try {
      const role = await Role.query()
        .where('id', params.id)
        .preload('users')
        .firstOrFail()
      
      return response.ok({
        message: 'Role users retrieved successfully',
        data: {
          role: role.name,
          users: role.users
        }
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'Role not found'
        })
      }
      
      return response.internalServerError({
        message: 'Failed to retrieve role users',
        error: error.message
      })
    }
  }
}