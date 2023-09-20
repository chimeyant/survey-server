import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FileManagements extends BaseSchema {
  protected tableName = 'file_managements'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid("uuid")
      table.string('filename');
      table.string("foldername",500)
      table.string("extension")
      table.string('size')
      table.boolean('used').defaultTo(false)

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
