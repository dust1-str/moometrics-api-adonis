import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new user
 */
export const createUserValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(100),
    email: vine
      .string()
      .trim()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine
      .string()
      .minLength(8)
      .maxLength(64)
      .confirmed(),
    roleId: vine
      .number()
      .positive()
      .exists(async (db, value) => {
        const role = await db.from('roles').where('id', value).first()
        return !!role
      })
  })
)

/**
 * Validator to validate the payload when updating
 * an existing user
 */
export const updateUserValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(2)
      .maxLength(100)
      .optional(),
    email: vine
      .string()
      .trim()
      .email()
      .normalizeEmail()
      .unique(async (db, value, field) => {
        const user = await db
          .from('users')
          .whereNot('id', field.data.params.id)
          .where('email', value)
          .first()
        return !user
      })
      .optional(),
    password: vine
      .string()
      .minLength(8)
      .maxLength(64)
      .confirmed()
      .optional(),
    roleId: vine
      .number()
      .positive()
      .exists(async (db, value) => {
        const role = await db.from('roles').where('id', value).first()
        return !!role
      })
      .optional()
  })
)

/**
 * Validator for updating user password
 */
export const changePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string(),
    password: vine
      .string()
      .minLength(8)
      .maxLength(64)
      .confirmed()
  })
)