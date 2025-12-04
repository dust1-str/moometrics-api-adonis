import vine from '@vinejs/vine'

/**
 * Validator for date range input
 */
export const dateRangeValidator = vine.compile(
  vine.object({
    startDate: vine.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: vine.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/)
  })
)

/**
 * Validator for clear data input
 */
export const clearDataValidator = vine.compile(
  vine.object({
    table: vine.string().trim().in(['inventory', 'events', 'both'])
  })
)