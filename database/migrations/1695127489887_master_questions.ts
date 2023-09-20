import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MasterQuestions extends BaseSchema {
  protected tableName = 'master_questions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid("uuid")
      table.uuid("master_type_uuid")
      table.text("question").nullable()
      table.boolean("status").defaultTo(false)

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
