import type { HttpContext } from '@adonisjs/core/http'
import Database from '@adonisjs/lucid/services/db'
import { dateRangeValidator, clearDataValidator } from '#validators/data_generator'
import Inventory from '#models/inventory'
import Event from '#models/event'

interface DateRange {
  startDate: string
  endDate: string
}

interface InventoryRecord {
  apiid: number
  stable_id: number
  barnnm: string
  bdate: string
  bdateweek: string
  brd: string
  dhfr: number
  bfcf: number
  sex: string
  sicrbr: string
  sirebreed: string
  sirc: string
  purcdate: string
  bv_me305: string
  chbrdnote: string
  seruresult: string
  sirsbr: string
}

interface EventRecord {
  evid: number
  pky: number
  technician: number
  eventtype: string
  evdate: string
  evfdat: string
  evage: number
  evdim: number
  evlact: number
  evlagr: number
  evpen: number
  age1blt: number
  agemo: number
  bdate: string
  brd: string
  sex: string
  assoprot: string
  dim: number
  evageday: number
  evagemo: number
  evgap: number
  evgaprange: string
  evloc: string
  evnote: string
  evnum: number
  evnumt: number
  evsirebreed: string
  evsirenaab: string
  evweek: string
  evsirestudcd: number
  msdevbarn: string
  tech: string
  levdesc: string
}

export default class DataGeneratorController {
  private cattleBreeds = [
    'Holstein', 'Jersey', 'Angus', 'Hereford', 'Simmental', 'Charolais', 
    'Limousin', 'Brahman', 'Gelbvieh', 'Red Angus', 'Brown Swiss', 
    'Shorthorn', 'Maine-Anjou', 'Chianina', 'Piedmontese'
  ]

  private eventTypes = [
    'breeding', 'birth', 'diagnosis', 'abortion', 'culling', 'dryoff', 
    'fresh', 'hoof', 'move', 'pregcheck', 'medical', 'vaccination', 'treatment'
  ]

  private diseases = [
    'Mastitis', 'Ketosis', 'Milk Fever', 'Retained Placenta', 'Metritis', 
    'Lameness', 'Pneumonia', 'Scours', 'Pink Eye', 'Foot Rot', 'BVD', 
    'IBR', 'Johnes Disease', 'Bloat', 'Hardware Disease'
  ]

  private locations = [
    'Barn A', 'Barn B', 'Pasture 1', 'Pasture 2', 'Milking Parlor', 
    'Dry Lot', 'Hospital Pen', 'Maternity Pen', 'Quarantine', 'Feed Lot'
  ]

  private technicians = [
    'Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis',
    'Tech Anderson', 'Tech Wilson', 'Tech Moore', 'Tech Taylor', 'Tech Jackson'
  ]

  private getRandomDate(startDate: Date, endDate: Date): Date {
    const start = startDate.getTime()
    const end = endDate.getTime()
    return new Date(start + Math.random() * (end - start))
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  private getWeekStart(date: Date): Date {
    const day = date.getDay()
    const diff = date.getDate() - day
    return new Date(date.setDate(diff))
  }

  async generateInventory({ request, response }: HttpContext) {
    try {
      const { startDate, endDate, stable_id } = await request.validateUsing(dateRangeValidator)

      const start = new Date(startDate)
      const end = new Date(endDate)

      if (start >= end) {
        return response.badRequest({
          status: 'error',
          message: 'Start date must be before end date',
          data: []
        })
      }

      const inventoryData: InventoryRecord[] = []
      
      for (let i = 1; i <= 4500; i++) {
        const birthDate = this.getRandomDate(start, end)
        const weekStart = this.getWeekStart(new Date(birthDate))
        const purchaseDate = this.getRandomDate(birthDate, end)
        const breed = this.getRandomElement(this.cattleBreeds)
        
        const cow: InventoryRecord = {
          apiid: i,
          stable_id: stable_id,
          barnnm: `Cow-${String(i).padStart(4, '0')}`,
          bdate: this.formatDate(birthDate),
          bdateweek: this.formatDate(weekStart),
          brd: breed,
          dhfr: this.getRandomInt(0, 5), // Days to first breeding
          bfcf: this.getRandomInt(0, 3), // Breeding difficulty factor
          sex: Math.random() > 0.1 ? 'F' : 'M', // 90% female, 10% male
          sicrbr: breed.substring(0, 2).toUpperCase(),
          sirebreed: breed.substring(0, 2).toUpperCase(),
          sirc: `SIRE${this.getRandomInt(1000, 9999)}`,
          purcdate: this.formatDate(purchaseDate),
          bv_me305: `${this.getRandomInt(8000, 15000)}`, // 305-day milk production
          chbrdnote: `Grade ${this.getRandomElement(['A', 'B', 'C'])}`,
          seruresult: this.getRandomElement(['Positive', 'Negative', 'Pending']),
          sirsbr: breed.substring(0, 2).toUpperCase()
        }
        
        inventoryData.push(cow)
      }

      // Insert in batches to avoid memory issues
      const batchSize = 500
      for (let i = 0; i < inventoryData.length; i += batchSize) {
        const batch = inventoryData.slice(i, i + batchSize)
        await Database.table('inventory').multiInsert(batch)
      }

      return response.created({
        status: 'success',
        message: `${inventoryData.length} inventory records generated successfully for stable ${stable_id}`,
        data: {
          generated: inventoryData.length,
          stable_id: stable_id,
          dateRange: { startDate, endDate }
        }
      })

    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error generating inventory data',
        data: error.message
      })
    }
  }

  async generateEvents({ request, response }: HttpContext) {
    try {
      const { startDate, endDate, stable_id } = await request.validateUsing(dateRangeValidator)

      const start = new Date(startDate)
      const end = new Date(endDate)

      if (start >= end) {
        return response.badRequest({
          status: 'error',
          message: 'Start date must be before end date',
          data: []
        })
      }

      // Get existing inventory pky values for the specified stable
      const inventory = await Database.from('inventory')
        .select('pky', 'bdate', 'brd', 'sex')
        .where('stable_id', stable_id)
      
      if (inventory.length === 0) {
        return response.badRequest({
          status: 'error',
          message: `No inventory records found for stable_id ${stable_id}. Generate inventory first.`,
          data: []
        })
      }

      const eventsData: EventRecord[] = []
      
      // Generate multiple events per cow to reach ~4500 events
      const eventsPerCow = Math.ceil(4500 / inventory.length)
      
      for (const cow of inventory) {
        const cowBirthDate = new Date(cow.bdate)
        
        for (let eventCount = 0; eventCount < eventsPerCow && eventsData.length < 4500; eventCount++) {
          const eventDate = this.getRandomDate(start, end)
          const eventType = this.getRandomElement(this.eventTypes)
          
          // Calculate age-related fields
          const ageInDays = Math.floor((eventDate.getTime() - cowBirthDate.getTime()) / (1000 * 60 * 60 * 24))
          const ageInMonths = Math.floor(ageInDays / 30)
          const ageInYears = Math.floor(ageInDays / 365)
          
          // Generate contextual data based on event type
          let eventNote = ''
          let diagnosis = ''
          
          switch (eventType) {
            case 'diagnosis':
              diagnosis = this.getRandomElement(this.diseases)
              eventNote = `Diagnosed: ${diagnosis}`
              break
            case 'treatment':
              eventNote = `Treatment for ${this.getRandomElement(this.diseases)}`
              break
            case 'breeding':
              eventNote = 'Artificial insemination'
              break
            case 'birth':
              eventNote = cow.sex === 'F' ? 'Calf born' : 'N/A'
              break
            case 'culling':
              eventNote = this.getRandomElement(['Low production', 'Health issues', 'Age', 'Breeding problems'])
              break
            default:
              eventNote = `${eventType} event`
          }

          const event: EventRecord = {
            evid: eventsData.length + 1,
            pky: cow.pky,
            technician: this.getRandomInt(1, 10),
            eventtype: eventType,
            evdate: this.formatDate(eventDate),
            evfdat: this.formatDate(eventDate),
            evage: ageInYears,
            evdim: this.getRandomInt(0, 400), // Days in milk
            evlact: this.getRandomInt(1, 8), // Lactation number
            evlagr: this.getRandomInt(0, 100), // Days in lactation
            evpen: this.getRandomInt(1, 20), // Pen number
            age1blt: this.getRandomInt(18, 30), // Age at first breeding
            agemo: ageInMonths,
            bdate: cow.bdate,
            brd: cow.brd,
            sex: cow.sex,
            assoprot: this.getRandomElement(['None', 'Antibiotic', 'Vaccine', 'Hormone']),
            dim: this.getRandomInt(0, 400),
            evageday: ageInDays % 365,
            evagemo: ageInMonths,
            evgap: this.getRandomInt(0, 200),
            evgaprange: this.getRandomElement(['0-50', '51-100', '101-150', '151-200', '200+']),
            evloc: this.getRandomElement(this.locations),
            evnote: eventNote.substring(0, 25),
            evnum: this.getRandomInt(1, 5),
            evnumt: this.getRandomInt(1, 3),
            evsirebreed: cow.brd.substring(0, 2),
            evsirenaab: `SIR${this.getRandomInt(100, 999)}`,
            evweek: this.formatDate(this.getWeekStart(new Date(eventDate))),
            evsirestudcd: this.getRandomInt(1000, 9999),
            msdevbarn: `BRN${this.getRandomInt(1, 99)}`,
            tech: this.getRandomElement(this.technicians),
            levdesc: diagnosis || eventNote.substring(0, 50)
          }
          
          eventsData.push(event)
        }
      }

      // Limit to exactly 4500 events
      const finalEvents = eventsData.slice(0, 4500)

      // Insert in batches
      const batchSize = 500
      for (let i = 0; i < finalEvents.length; i += batchSize) {
        const batch = finalEvents.slice(i, i + batchSize)
        await Database.table('events').multiInsert(batch)
      }

      return response.created({
        status: 'success',
        message: `${finalEvents.length} event records generated successfully for stable ${stable_id}`,
        data: {
          generated: finalEvents.length,
          stable_id: stable_id,
          dateRange: { startDate, endDate },
          eventTypes: this.eventTypes
        }
      })

    } catch (error) {
      return response.internalServerError({
        status: 'error',
        message: 'Error generating events data',
        data: error.message
      })
    }
  }

  async clearData({ request, response }: HttpContext) {
    try {
      const { table, startDate, endDate, stable_id } = await request.validateUsing(clearDataValidator)

      // Validate date range if provided
      if ((startDate && !endDate) || (!startDate && endDate)) {
        return response.badRequest({
          status: 'error',
          message: 'Both startDate and endDate must be provided when using date range deletion',
          data: []
        })
      }

      if (startDate && endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)
        if (start >= end) {
          return response.badRequest({
            status: 'error',
            message: 'Start date must be before end date',
            data: []
          })
        }
      }

      let deletedTables: string[] = []
      let deletedCounts = { inventory: 0, events: 0 }

      if (startDate && endDate) {
        // Delete by date range
        if (table === 'inventory' || table === 'both') {
          // First get inventory records to delete based on criteria
          let inventoryQuery = Inventory.query().whereBetween('bdate', [startDate, endDate])
          if (stable_id) {
            inventoryQuery = inventoryQuery.where('stable_id', stable_id)
          }
          const inventoryToDelete = await inventoryQuery.select('pky')
          const pkyList = inventoryToDelete.map(item => item.pky)
          
          // Delete events first (foreign key constraint)
          if (pkyList.length > 0) {
            const deletedEvents = await Event.query().whereIn('pky', pkyList).delete()
            deletedCounts.events = Array.isArray(deletedEvents) ? deletedEvents.length : deletedEvents
          }
          
          // Delete inventory records
          const deletedInventory = await inventoryQuery.delete()
          deletedCounts.inventory = Array.isArray(deletedInventory) ? deletedInventory.length : deletedInventory
          
          deletedTables.push('inventory', 'events')
        } else if (table === 'events') {
          // Delete events by date range
          let eventsQuery = Event.query().whereBetween('evdate', [startDate, endDate])
          
          if (stable_id) {
            // Get inventory pky values for the stable
            const inventoryPkys = await Inventory.query().where('stable_id', stable_id).select('pky')
            const pkyList = inventoryPkys.map(item => item.pky)
            if (pkyList.length > 0) {
              eventsQuery = eventsQuery.whereIn('pky', pkyList)
            } else {
              deletedCounts.events = 0
              deletedTables.push('events')
              return response.ok({
                status: 'success',
                message: `No events found for stable ${stable_id} in the specified date range`,
                data: {
                  clearedTables: deletedTables,
                  dateRange: { startDate, endDate },
                  stable_id: stable_id,
                  deletedCounts
                }
              })
            }
          }
          
          const deletedEvents = await eventsQuery.delete()
          deletedCounts.events = Array.isArray(deletedEvents) ? deletedEvents.length : deletedEvents
          deletedTables.push('events')
        }

        return response.ok({
          status: 'success',
          message: `Data cleared successfully from: ${deletedTables.join(', ')} between ${startDate} and ${endDate}${stable_id ? ` for stable ${stable_id}` : ''}`,
          data: {
            clearedTables: deletedTables,
            dateRange: { startDate, endDate },
            stable_id: stable_id,
            deletedCounts
          }
        })
      } else {
        // Delete all data (with optional stable_id filter)
        if (table === 'inventory' || table === 'both') {
          if (stable_id) {
            // Get inventory records for the stable
            const inventoryToDelete = await Inventory.query().where('stable_id', stable_id).select('pky')
            const pkyList = inventoryToDelete.map(item => item.pky)
            
            // Delete events first
            if (pkyList.length > 0) {
              const deletedEvents = await Event.query().whereIn('pky', pkyList).delete()
              deletedCounts.events = Array.isArray(deletedEvents) ? deletedEvents.length : deletedEvents
            }
            
            // Delete inventory records
            const deletedInventory = await Inventory.query().where('stable_id', stable_id).delete()
            deletedCounts.inventory = Array.isArray(deletedInventory) ? deletedInventory.length : deletedInventory
          } else {
            // Delete all events first
            const deletedEvents = await Event.query().delete()
            deletedCounts.events = Array.isArray(deletedEvents) ? deletedEvents.length : deletedEvents
            
            // Delete all inventory
            const deletedInventory = await Inventory.query().delete()
            deletedCounts.inventory = Array.isArray(deletedInventory) ? deletedInventory.length : deletedInventory
            
            // Reset sequence only when deleting all data
            await Database.rawQuery('ALTER SEQUENCE pky_sequence RESTART WITH 1')
          }
          
          deletedTables.push('inventory', 'events')
        } else if (table === 'events') {
          if (stable_id) {
            // Get inventory pky values for the stable
            const inventoryPkys = await Inventory.query().where('stable_id', stable_id).select('pky')
            const pkyList = inventoryPkys.map(item => item.pky)
            
            if (pkyList.length > 0) {
              const deletedEvents = await Event.query().whereIn('pky', pkyList).delete()
              deletedCounts.events = Array.isArray(deletedEvents) ? deletedEvents.length : deletedEvents
            }
          } else {
            const deletedEvents = await Event.query().delete()
            deletedCounts.events = Array.isArray(deletedEvents) ? deletedEvents.length : deletedEvents
          }
          
          deletedTables.push('events')
        }

        return response.ok({
          status: 'success',
          message: `${stable_id ? 'Filtered' : 'All'} data cleared successfully from: ${deletedTables.join(', ')}${stable_id ? ` for stable ${stable_id}` : ''}`,
          data: {
            clearedTables: deletedTables,
            stable_id: stable_id,
            deletedCounts
          }
        })
      }

    } catch (error) {
      console.error('Clear data error:', error)
      return response.internalServerError({
        status: 'error',
        message: 'Error clearing data',
        data: {
          message: error.message || 'Unknown error',
          stack: error.stack,
          name: error.name,
          cause: error.cause,
          details: error
        }
      })
    }
  }

}