import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new message
 */
export const createMessageValidator = vine.compile(
  vine.object({
    content: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(2000)
  })
)

/**
 * Validator to validate the payload when updating
 * an existing message
 */
export const updateMessageValidator = vine.compile(
  vine.object({
    content: vine
      .string()
      .trim()
      .minLength(1)
      .maxLength(2000)
  })
)