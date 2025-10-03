import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new stable
 */
export const createStableValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(100)
      .unique(async (db, value) => {
        const stable = await db.from('stables').where('name', value).first()
        return !stable
      }),
    isActive: vine.boolean().optional()
  })
)

/**
 * Validator to validate the payload when updating
 * an existing stable
 */
export const updateStableValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(100)
      .unique(async (db, value, field) => {
        const stable = await db
          .from('stables')
          .whereNot('id', field.data.params.id)
          .where('name', value)
          .first()
        return !stable
      })
      .optional(),
    isActive: vine.boolean().optional()
  })
)