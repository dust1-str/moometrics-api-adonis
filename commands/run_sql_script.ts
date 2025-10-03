import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export default class RunSqlScript extends BaseCommand {
  static commandName = 'db:run-sql-script'
  static description = 'Ejecuta un script SQL desde un archivo o texto directo'

  static options: CommandOptions = {
    startApp: true,
  }

  @args.string({ description: 'Ruta del archivo SQL o SQL directo' })
  declare sqlInput: string

  @flags.boolean({ description: 'Indica si el input es SQL directo en lugar de un archivo' })
  declare direct: boolean

  @flags.boolean({ description: 'Ejecutar en una transacción' })
  declare transaction: boolean

  @flags.boolean({ description: 'Mostrar el SQL antes de ejecutar' })
  declare verbose: boolean

  public async run() {
    try {
      let sqlContent: string

      if (this.direct) {
        // SQL directo desde la línea de comandos
        sqlContent = this.sqlInput
        this.logger.info('Ejecutando SQL directo...')
      } else {
        // Leer desde archivo
        const filePath = this.sqlInput.startsWith('/') || this.sqlInput.includes(':')
          ? this.sqlInput
          : join(process.cwd(), this.sqlInput)

        if (!existsSync(filePath)) {
          this.logger.error(`El archivo ${filePath} no existe`)
          return
        }

        sqlContent = readFileSync(filePath, 'utf8')
        this.logger.info(`Ejecutando script desde: ${filePath}`)
      }

      if (this.verbose) {
        this.logger.info('SQL a ejecutar:')
        console.log(sqlContent)
        console.log('---')
      }

      // Dividir por punto y coma para ejecutar múltiples statements
      const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0)

      if (this.transaction) {
        // Ejecutar en transacción
        await db.transaction(async (trx) => {
          for (const statement of statements) {
            await trx.rawQuery(statement)
            this.logger.info(`✓ Ejecutado: ${statement.substring(0, 50)}...`)
          }
        })
        this.logger.success(`✅ ${statements.length} statements ejecutados en transacción`)
      } else {
        // Ejecutar statements individuales
        for (const statement of statements) {
          await db.rawQuery(statement)
          this.logger.info(`✓ Ejecutado: ${statement.substring(0, 50)}...`)
        }
        this.logger.success(`✅ ${statements.length} statements ejecutados`)
      }

    } catch (error) {
      this.logger.error('❌ Error ejecutando el script SQL:')
      this.logger.error(error.message)
      
      if (this.verbose) {
        console.error(error)
      }
    }
  }
}