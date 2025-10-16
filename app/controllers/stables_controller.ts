import type { HttpContext } from '@adonisjs/core/http'
import Stable from '#models/stable'
import { createStableValidator, updateStableValidator } from '#validators/stable'

export default class StablesController {
  async index({ response }: HttpContext) {
    try {
      const stables = await Stable.query()
        .orderBy('name', 'asc')
      
      return response.ok({
        status: 'success',
        message: 'Establos obtenidos exitosamente',
        data: stables
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al obtener los establos',
        data: error.message
      })
    }
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createStableValidator)

    try {      
      const stable = await Stable.create(payload)
      
      return response.created({
        status: 'success',
        message: 'Establo creado exitosamente',
        data: stable
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al crear el establo',
        data: error.message
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const stable = await Stable.query()
        .where('id', params.id)
        .preload('channels', (query) => {
          query.select('id', 'name', 'description').where('isActive', true)
        })
        .first()
      
      if (!stable) {
        return response.notFound({
          status: 'error',
          message: 'Establo no encontrado',
          data: []
        })
      }
      
      return response.ok({
        status: 'success',
        message: 'Establo obtenido exitosamente',
        data: stable
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al obtener el establo',
        data: error.message
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateStableValidator)

    try {
      const stable = await Stable.find(params.id)
      
      if (!stable) {
        return response.notFound({
          status: 'error',
          message: 'Establo no encontrado',
          data: []
        })
      }
      
      stable.merge(payload)
      await stable.save()
      
      return response.ok({
        status: 'success',
        message: 'Establo actualizado exitosamente',
        data: stable
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al actualizar el establo',
        data: error.message
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const stable = await Stable.find(params.id)
      
      if (!stable) {
        return response.notFound({
          status: 'error',
          message: 'Establo no encontrado',
          data: []
        })
      }

      stable.isActive = false
      await stable.save()
      
      return response.ok({
        status: 'success',
        message: 'Establo eliminado exitosamente',
        data: []
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al eliminar el establo',
        data: error.message
      })
    }
  }

  async active({ response }: HttpContext) {
    try {
      const stables = await Stable.query()
        .where('isActive', true)
        .orderBy('name', 'asc')
      
      return response.ok({
        status: 'success',
        message: 'Establos activos obtenidos exitosamente',
        data: stables
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al obtener los establos activos',
        data: error.message
      })
    }
  }

  async channels({ params, response }: HttpContext) {
    try {
      const stable = await Stable.query()
        .where('id', params.id)
        .preload('channels')
        .first()
      
      if (!stable) {
        return response.notFound({
          status: 'error',
          message: 'Establo no encontrado',
          data: []
        })
      }
      
      return response.ok({
        status: 'success',
        message: 'Canales del establo obtenidos exitosamente',
        data: {
          stable: {
            id: stable.id,
            name: stable.name
          },
          channels: stable.channels
        }
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al obtener los canales del establo',
        data: error.message
      })
    }
  }
}