import { DateTime } from 'luxon'
import {compose} from "@ioc:Adonis/Core/Helpers"
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import {v4 as uuid} from "uuid"
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'

export default class TrxLine extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid:string

  @column()
  public trxUuid:string

  @column()
  public masterTypeUuid:string

  @column()
  public masterQuestionUuid:string

  @column()
  public tidakSesuai:number

  @column()
  public sesuai:number

  @column()
  public sangatSesuai:number

  @column()
  public deletedAt: DateTime | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUUID(trxline:TrxLine){
    trxline.uuid = uuid()
  }
}
