import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Channel from './channel.js'

export default class Stable extends BaseModel {
  public static table = 'stables'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare isActive: boolean

  // Relaciones
  @hasMany(() => Channel)
  declare channels: HasMany<typeof Channel>
}