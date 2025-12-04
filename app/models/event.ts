import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Event extends BaseModel {
  public static table = 'events'

  @column({ isPrimary: true })
  declare evid: number

  @column()
  declare pky: number

  @column()
  declare technician: number

  @column()
  declare eventtype: string

  @column.date()
  declare evdate: DateTime

  @column.date()
  declare evfdat: DateTime

  @column()
  declare evage: number

  @column()
  declare evdim: number

  @column()
  declare evlact: number

  @column()
  declare evlagr: number

  @column()
  declare evpen: number

  @column()
  declare age1blt: number

  @column()
  declare agemo: number

  @column.date()
  declare bdate: DateTime

  @column()
  declare brd: string

  @column()
  declare sex: string

  @column()
  declare assoprot: string

  @column()
  declare dim: number

  @column()
  declare evageday: number

  @column()
  declare evagemo: number

  @column()
  declare evgap: number

  @column()
  declare evgaprange: string

  @column()
  declare evloc: string

  @column()
  declare evnote: string

  @column()
  declare evnum: number

  @column()
  declare evnumt: number

  @column()
  declare evsirebreed: string

  @column()
  declare evsirenaab: string

  @column.date()
  declare evweek: DateTime

  @column()
  declare evsirestudcd: number

  @column()
  declare msdevbarn: string

  @column()
  declare tech: string

  @column()
  declare levdesc: string
}