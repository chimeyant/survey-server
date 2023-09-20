import { DateTime } from 'luxon'
import {compose} from "@ioc:Adonis/Core/Helpers"
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import {v4 as uuid} from "uuid"
import { BaseModel, BelongsTo, beforeCreate, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import MasterType from './MasterType'

export default class MasterQuestion extends compose(BaseModel, SoftDeletes ) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid:string

  @column()
  public masterTypeUuid:string

  @column()
  public question:string

  @column()
  public status:boolean

  @column()
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUUID(masterQuestion: MasterQuestion){
    masterQuestion.uuid = uuid()
  }

  @belongsTo(()=> MasterType,{foreignKey:"master_type_uuid",localKey:"uuid"})
  public mastertype: BelongsTo<typeof MasterType>

  @computed()
  public get datadisplay(){
    return{
      id: this.uuid,
      question: this.question,
      status: this.status ? {color:'green', text:'Aktif'}:{color:'red', text:"Tidak Aktif"}
    }
  }

  @computed()
  public get datarecord(){
    return {
      id: this.uuid,
      question: this.question,
      status: this.status,
    }
  }
}
