import type { HttpContext } from '@adonisjs/core/http'

export default class ChatbotController {
  async sendCommand({ request, response }: HttpContext) {
    try {
      const { command } = request.only(['command'])

      if (!command) {
        return response.badRequest({
          status: 'error',
          message: 'El comando es requerido',
          data: []
        })
      }

      const commandLower = command.toLowerCase().trim()
      let botResponse: object

      // Procesar comandos
      switch (commandLower) {
        case '/ayuda':
          botResponse = {
            command: '/ayuda',
            response: 'Comandos disponibles: /ayuda, /clima, /hora, /noticias, /saludo',
            type: 'help'
          }
          break

        case '/clima':
          botResponse = {
            command: '/clima',
            response: 'Clima actual: 22°C, Soleado con algunas nubes. Humedad: 65%',
            type: 'weather',
            data: {
              temperature: 22,
              condition: 'Soleado',
              humidity: 65
            }
          }
          break

        case '/hora':
          botResponse = {
            command: '/hora',
            response: `La hora actual es: ${new Date().toLocaleTimeString('es-ES')}`,
            type: 'time',
            data: {
              timestamp: new Date().toISOString()
            }
          }
          break

        case '/noticias':
          botResponse = {
            command: '/noticias',
            response: 'Últimas noticias: Sector ganadero en crecimiento. Nuevas regulaciones para la salud animal. Aumento en precios de forraje.',
            type: 'news',
            data: [
              { title: 'Sector ganadero en crecimiento', date: '2025-12-03' },
              { title: 'Nuevas regulaciones para la salud animal', date: '2025-12-02' },
              { title: 'Aumento en precios de forraje', date: '2025-12-01' }
            ]
          }
          break

        case '/saludo':
          botResponse = {
            command: '/saludo',
            response: '¡Hola! Bienvenido a MooMetrics. ¿En qué puedo ayudarte hoy?',
            type: 'greeting'
          }
          break

        default:
          return response.badRequest({
            status: 'error',
            message: `Comando desconocido: ${command}. Usa /ayuda para ver los comandos disponibles`,
            data: []
          })
      }

      return response.ok({
        status: 'success',
        message: 'Comando procesado exitosamente',
        data: botResponse
      })
    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error al procesar el comando',
        data: error.message
      })
    }
  }
}
