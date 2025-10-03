import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Message from './message.js'
import Stable from './stable.js'

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare createdBy: number

  @column()
  declare stableId: number | null

  @column()
  declare isActive: boolean

  // Relaciones
  @belongsTo(() => User, {
    foreignKey: 'createdBy'
  })
  declare creator: BelongsTo<typeof User>

  @belongsTo(() => Stable)
  declare stable: BelongsTo<typeof Stable>

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>
}