import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import hash from '@adonisjs/core/services/hash'

export default class OtpToken extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column({ serializeAs: null })
  declare token: string

  @column()
  declare isValid: boolean

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  /**
   * Encripta y guarda el token OTP
   */
  static async createForUser(userId: number, plainToken: string) {
    // Eliminar tokens anteriores del usuario
    await OtpToken.query().where('user_id', userId).delete()

    // Encriptar el token
    const hashedToken = await hash.make(plainToken)

    // Crear nuevo token
    return await OtpToken.create({
      userId,
      token: hashedToken,
      isValid: true
    })
  }

  /**
   * Verifica si el token coincide
   */
  async verify(plainToken: string): Promise<boolean> {
    if (!this.isValid) {
      return false
    }

    return await hash.verify(this.token, plainToken)
  }

  /**
   * Invalida el token
   */
  async invalidate() {
    this.isValid = false
    await this.save()
  }
}
