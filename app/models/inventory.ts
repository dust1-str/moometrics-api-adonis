import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Inventory extends BaseModel {
  @column({ isPrimary: true })
  declare apiid: number

  @column()
  declare stable_id: number

  @column()
  declare barnnm: string

  @column.date()
  declare bdate: DateTime

  @column.date()
  declare bdateweek: DateTime

  @column()
  declare brd: string

  @column()
  declare dhfr: number

  @column()
  declare bfcf: number

  @column()
  declare sex: string

  @column()
  declare sicrbr: string

  @column()
  declare sirebreed: string

  @column()
  declare sirc: string

  @column.date()
  declare purcdate: DateTime

  @column()
  declare bv_me305: string

  @column()
  declare chbrdnote: string

  @column()
  declare seruresult: string

  @column()
  declare sirsbr: string

  @column()
  declare pky: number
}