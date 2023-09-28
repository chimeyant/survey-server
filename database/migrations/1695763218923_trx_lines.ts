import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TrxLines extends BaseSchema {
  protected tableName = 'trx_lines'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid("uuid")
      table.uuid('trx_uuid').nullable()
      table.uuid("master_type_uuid")
      table.uuid('master_question_uuid')
      table.integer("tidak_sesuai").defaultTo(0)
      table.integer('sesuai').defaultTo(0)
      table.integer("sangat_sesuai").defaultTo(0)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("deleted_at",{useTz:true})
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
