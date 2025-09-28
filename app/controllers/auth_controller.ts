import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    try {
      const payload = request.only(['name', 'email', 'password', 'roleId'])

      const existingUser = await User.findBy('email', payload.email)
      if (existingUser) {
        return response.conflict({
          message: 'El usuario ya existe con este email'
        })
      }

      const user = await User.create(payload)
      await user.load('role')
      
      return response.created({
        message: 'Usuario registrado exitosamente',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al registrar usuario',
        error: error.message
      })
    }
  }

  async login({ request, auth, response }: any) {
      const { email, password } = request.only(['email', 'password'])
      const user = await User.verifyCredentials(email, password)
      const token = await auth.use('jwt').generate(user)

      return response.ok({
        status: 'success',
        message: 'Inicio de sesión exitoso',
        data: token
      })
  }
}