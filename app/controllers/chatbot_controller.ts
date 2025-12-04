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
        case 'showinventory':
          botResponse = this.handleShowInventory()
          break

        case 'showevents':
          botResponse = this.handleShowEvents()
          break

        case 'getcowlist':
          botResponse = this.handleGetCowList()
          break

        case 'getcowdetail':
          botResponse = this.handleGetCowDetail()
          break

        case 'searchcow':
          botResponse = this.handleSearchCow()
          break

        default:
          return response.badRequest({
            status: 'error',
            message: `Comando desconocido: ${command}. Comandos disponibles: showInventory, showEvents, getCowList, getCowDetail, searchCow`,
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

  private handleShowInventory() {
    return {
      command: 'showInventory',
      type: 'inventory',
      stableName: 'Establo Principal',
      summary: {
        totalCows: 245,
        females: 180,
        males: 65
      },
      byBreed: [
        { breed: 'Holstein', count: 120 },
        { breed: 'Jersey', count: 75 },
        { breed: 'Guernsey', count: 50 }
      ],
      byAge: [
        { ageRange: '0-1 años', count: 30 },
        { ageRange: '1-2 años', count: 45 },
        { ageRange: '2-3 años', count: 85 },
        { ageRange: '3+ años', count: 85 }
      ],
      byStatus: [
        { status: 'Activa', count: 230 },
        { status: 'Gestante', count: 12 },
        { status: 'Descanso', count: 3 }
      ]
    }
  }

  private handleShowEvents() {
    return {
      command: 'showEvents',
      type: 'events',
      stableName: 'Establo Principal',
      period: 'este mes (Diciembre 2025)',
      veterinaryEvents: [
        { type: 'diagnosis', count: 15 },
        { type: 'treatment', count: 22 }
      ],
      reproductiveEvents: [
        { type: 'breeding', count: 8 },
        { type: 'pregnancy_check', count: 12 },
        { type: 'birth', count: 2 }
      ],
      managementEvents: [
        { type: 'feeding', count: 150 },
        { type: 'cleaning', count: 45 }
      ],
      totalEvents: 256
    }
  }

  private handleGetCowList() {
    return {
      command: 'getCowList',
      type: 'cow_list',
      cows: [
        {
          id: 1,
          name: 'Bessie',
          breed: 'Holstein',
          age: '3 años',
          sex: 'F',
          barnName: 'Corral A'
        },
        {
          id: 2,
          name: 'Daisy',
          breed: 'Jersey',
          age: '2 años',
          sex: 'F',
          barnName: 'Corral B'
        },
        {
          id: 3,
          name: 'Molly',
          breed: 'Guernsey',
          age: '4 años',
          sex: 'F',
          barnName: 'Corral A'
        },
        {
          id: 4,
          name: 'Stella',
          breed: 'Holstein',
          age: '2 años',
          sex: 'F',
          barnName: 'Corral C'
        },
        {
          id: 5,
          name: 'Luna',
          breed: 'Jersey',
          age: '3 años',
          sex: 'F',
          barnName: 'Corral B'
        },
        {
          id: 6,
          name: 'Max',
          breed: 'Holstein',
          age: '5 años',
          sex: 'M',
          barnName: 'Corral D'
        },
        {
          id: 7,
          name: 'Rocky',
          breed: 'Guernsey',
          age: '6 años',
          sex: 'M',
          barnName: 'Corral D'
        }
      ],
      pagination: {
        currentPage: 1,
        itemsPerPage: 7,
        totalItems: 245,
        totalPages: 35
      }
    }
  }

  private handleGetCowDetail() {
    return {
      command: 'getCowDetail',
      type: 'cow_detail',
      id: 1,
      name: 'Bessie',
      breed: 'Holstein',
      sex: 'F',
      birthDate: '2021-03-15',
      age: '3 años',
      barnName: 'Corral A',
      lactationNumber: 2,
      daysInMilk: 245,
      dailyProduction: '32.5 litros',
      events: {
        diagnoses: 5,
        pregnancyChecks: 3,
        breedings: 2,
        treatments: 8,
        births: 1
      },
      lastEvent: {
        type: 'pregnancy_check',
        date: '2025-12-02T10:30:00Z',
        technician: 'Dr. López',
        status: 'Gestante'
      }
    }
  }

  private handleSearchCow() {
    return {
      command: 'searchCow',
      type: 'search_result',
      query: 'Holstein',
      results: [
        {
          id: 1,
          name: 'Bessie',
          breed: 'Holstein',
          sex: 'F'
        },
        {
          id: 3,
          name: 'Stella',
          breed: 'Holstein',
          sex: 'F'
        },
        {
          id: 6,
          name: 'Max',
          breed: 'Holstein',
          sex: 'M'
        },
        {
          id: 8,
          name: 'Clara',
          breed: 'Holstein',
          sex: 'F'
        },
        {
          id: 12,
          name: 'Nina',
          breed: 'Holstein',
          sex: 'F'
        }
      ],
      totalFound: 5
    }
  }
}
