import { DateTime } from 'luxon'
import {v4 as uuid} from "uuid"
import { BaseModel, column ,beforeCreate} from '@ioc:Adonis/Lucid/Orm'

export default class Slider extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid:string

  @column()
  public title:string

  @column()
  public subtitle:string

  @column()
  public content:string

  @column()
  public path:string

  @column()
  public status:boolean

  @column()
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUUID(slider:Slider){
    slider.uuid = uuid()
  }
}
