import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new channel
 */
export const createChannelValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(50)
      .unique(async (db, value) => {
        const channel = await db.from('channels').where('name', value).first()
        return !channel
      }),
    description: vine.string().trim().maxLength(500).optional(),
    stableId: vine
      .number()
      .positive()
      .exists(async (db, value) => {
        const stable = await db.from('stables').where('id', value).where('is_active', true).first()
        return !!stable
      })
  })
)

/**
 * Validator to validate the payload when updating
 * an existing channel
 */
export const updateChannelValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(50)
      .unique(async (db, value, field) => {
        const channel = await db
          .from('channels')
          .whereNot('id', field.data.params.id)
          .where('name', value)
          .first()
        return !channel
      })
      .optional(),
    description: vine.string().maxLength(500).optional(),
    stableId: vine
      .number()
      .positive()
      .exists(async (db, value) => {
        const stable = await db.from('stables').where('id', value).where('is_active', true).first()
        return !!stable
      })
      .optional(),
    isActive: vine.boolean().optional()
  })
)