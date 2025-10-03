import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'channels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 100).notNullable().unique()
      table.text('description').nullable()
      table.integer('stable_id').unsigned().references('id').inTable('stables').onDelete('SET NULL').nullable()
      table.integer('created_by').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.boolean('is_active').defaultTo(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}