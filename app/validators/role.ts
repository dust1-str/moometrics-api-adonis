import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new role
 */
export const createRoleValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(50)
      .unique(async (db, value) => {
        const role = await db.from('roles').where('name', value).first()
        return !role
      }),
    description: vine.string().trim().optional()
  })
)

/**
 * Validator to validate the payload when updating
 * an existing role
 */
export const updateRoleValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(50)
      .unique(async (db, value, field) => {
        const role = await db
          .from('roles')
          .whereNot('id', field.data.params.id)
          .where('name', value)
          .first()
        return !role
      })
      .optional(),
    description: vine.string().trim().optional()
  })
)