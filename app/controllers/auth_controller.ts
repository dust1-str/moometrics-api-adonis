import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    try {
      const payload = request.only(['name', 'email', 'password'])

      const existingUser = await User.findBy('email', payload.email)
      if (existingUser) {
        return response.conflict({
          message: 'El usuario ya existe con este email'
        })
      }

      const user = await User.create({
        ...payload,
        roleId: 3
      })
      
      return response.created({
        status: 'success',
        message: 'Usuario registrado exitosamente',
        data: user
      })
    } catch (error) {
      return response.badRequest({
        status: 'error',
        message: 'Error al registrar usuario',
        error: error.message
      })
    }
  }

    async login({ request, auth, response }: any) {
      const { email, password, fcmToken } = request.only(['email', 'password', 'fcmToken'])
      let user;

      try {
        user = await User.verifyCredentials(email, password)
      } catch (error) {
        return response.unauthorized({
          status: 'error',
          message: 'Credenciales inválidas',
          data: []
        })
      }
      
      const token = await auth.use('jwt').generate(user)
      const userUpdate = await User.findBy('email', email)
      if (userUpdate && fcmToken) {
        userUpdate.fcmToken = fcmToken
        await userUpdate.save()
      }

      return response.ok({
        status: 'success',
        message: 'Inicio de sesión exitoso',
        data: token
      })
  }
}