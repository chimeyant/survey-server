import { DateTime } from 'luxon'
import {v4 as uuid} from "uuid"
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import {compose} from "@ioc:Adonis/Core/Helpers"
import { BaseModel, beforeCreate, column, computed } from '@ioc:Adonis/Lucid/Orm'

export default class Contact extends compose(BaseModel,SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid:string

  @column()
  public userUuid:string

  @column()
  public name:string

  @column()
  public phone:number

  @column()
  public status:boolean

  @column()
  public deletedAt:DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUUID(contact:Contact){
    contact.uuid = uuid()
  }

  @computed()
  public get datadisplay(){
    return{
      id:this.uuid,
      name: this.name,
      phone: this.phone,
      status: this.status ? {color:'green',text:"Aktif"} : {color:'red', text:'Tidak Aktif'}
    }
  }

  @computed()
  public get datarecord(){
    return {
      id: this.uuid,
      name: this.name,
      phone: this.phone,
      status: this.status
    }
  }

}
