import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import EmailService from '#services/EmailService'
import OtpToken from '#models/otp_token'

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
      console.log('🔵 [LOGIN] Iniciando proceso de login')
      const { email, password, fcmToken } = request.only(['email', 'password', 'fcmToken'])
      console.log('🔵 [LOGIN] Email recibido:', email)
      console.log('🔵 [LOGIN] FCM Token recibido:', fcmToken ? 'Sí' : 'No')
      
      let user;

      try {
        console.log('🔵 [LOGIN] Verificando credenciales...')
        user = await User.verifyCredentials(email, password)
        console.log('✅ [LOGIN] Credenciales verificadas. User ID:', user.id)
      } catch (error) {
        console.log('❌ [LOGIN] Credenciales inválidas')
        return response.unauthorized({
          status: 'error',
          message: 'Credenciales inválidas',
          data: []
        })
      }
      
      console.log('🔵 [LOGIN] Generando token JWT...')
      const token = await auth.use('jwt').generate(user)
      console.log('✅ [LOGIN] Token JWT generado')
      
      console.log('🔵 [LOGIN] Actualizando FCM token si existe...')
      const userUpdate = await User.findBy('email', email)
      if (userUpdate && fcmToken) {
        userUpdate.fcmToken = fcmToken
        await userUpdate.save()
        console.log('✅ [LOGIN] FCM token actualizado')
      }

      // Generar código OTP de 6 dígitos
      console.log('🔵 [LOGIN] Generando código OTP...')
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
      console.log('✅ [LOGIN] Código OTP generado:', otpCode)

      // Guardar el token OTP encriptado en la base de datos
      console.log('🔵 [LOGIN] Guardando OTP en base de datos...')
      await OtpToken.createForUser(user.id, otpCode)
      console.log('✅ [LOGIN] OTP guardado en base de datos')

      // Enviar correo con OTP
      console.log('🔵 [LOGIN] Enviando correo con OTP...')
      try {
        await EmailService.sendEmail({
          to: user.email,
          subject: 'Código de verificación - MooMetrics',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333;">Código de verificación</h2>
              <p>Hola ${user.name || 'Usuario'},</p>
              <p>Has iniciado sesión exitosamente. Tu código de verificación es:</p>
              <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <h1 style="color: #4CAF50; font-size: 36px; margin: 0; letter-spacing: 8px;">${otpCode}</h1>
              </div>
              <p>Este código es válido por 10 minutos.</p>
              <p style="color: #666; font-size: 14px;">Si no has sido tú quien inició sesión, por favor ignora este correo.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="color: #999; font-size: 12px;">© 2025 MooMetrics. Todos los derechos reservados.</p>
            </div>
          `
        })
        console.log('✅ [LOGIN] Correo enviado exitosamente')
      } catch (emailError) {
        console.error('❌ [LOGIN] Error enviando OTP por email:', emailError)
        // No fallar el login si el email falla
      }

      console.log('🔵 [LOGIN] Preparando respuesta final...')
      const responseData = {
        status: 'success',
        message: 'Inicio de sesión exitoso',
        data: {
          ...token,
          otpSent: true,
          userId: user.id
        }
      }
      console.log('✅ [LOGIN] Respuesta a enviar:', JSON.stringify(responseData, null, 2))
      
      return response.ok(responseData)
  }

  async verifyOtp({ request, response }: HttpContext) {
    try {
      const { userId, otpCode } = request.only(['userId', 'otpCode'])

      if (!userId || !otpCode) {
        return response.badRequest({
          status: 'error',
          message: 'userId y otpCode son requeridos',
          data: []
        })
      }

      // Buscar el token OTP válido del usuario
      const otpToken = await OtpToken.query()
        .where('user_id', userId)
        .where('is_valid', true)
        .first()

      if (!otpToken) {
        return response.unauthorized({
          status: 'error',
          message: 'Token OTP no encontrado o ya fue usado',
          data: []
        })
      }

      // Verificar si el token coincide
      const isValid = await otpToken.verify(otpCode)

      if (!isValid) {
        return response.unauthorized({
          status: 'error',
          message: 'Código OTP inválido',
          data: []
        })
      }

      // Invalidar el token
      await otpToken.invalidate()

      return response.ok({
        status: 'success',
        message: 'Código OTP verificado exitosamente',
        data: {
          verified: true
        }
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al verificar el código OTP',
        data: error.message
      })
    }
  }
}