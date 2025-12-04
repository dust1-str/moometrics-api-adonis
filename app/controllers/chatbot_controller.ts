import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ChatbotController {
  private eventTypes = [
    'breeding', 'birth', 'diagnosis', 'abortion', 'culling', 'dryoff',
    'fresh', 'hoof', 'move', 'pregcheck', 'medical', 'vaccination', 'treatment'
  ]
  async sendCommand({ request, response }: HttpContext) {
    try {
      const { command, stable_id } = request.only(['command', 'stable_id'])

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
          botResponse = await this.handleShowEvents(stable_id)
          break

        case 'getcowlist':
          botResponse = await this.handleGetCowList(stable_id)
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

  private async handleShowEvents(stable_id: number) {
    const counts = await db.from('events')
      .select('eventtype')
      .count('* as total')
      .where('stable_id', stable_id)
      .groupBy('eventtype')

    const countMap = counts.reduce((acc, row) => {
      acc[row.eventtype] = Number(row.total)
      return acc
    }, {})

    const result = this.eventTypes.map(type => ({
      type,
      count: countMap[type] ?? 0
    }))

    return {
      command: 'showEvents',
      type: 'events',
      events: result,
      totalEvents: result.reduce((s, e) => s + e.count, 0)
    }
  }

  private async handleGetCowList(stable_id: number) {
    const cows = await db.from('inventory')
      .select('pky', 'barnnm', 'brd', 'bdate', 'sex')
      .where('stable_id', stable_id)
    return {
      command: 'getCowList',
      type: 'cow_list',
      cows: cows.map(cow => ({
        id: cow.pky,
        name: cow.barnnm,
        breed: cow.brd,
        birthDate: cow.bdate,
        sex: cow.sex
      })),
      totalCows: cows.length
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
