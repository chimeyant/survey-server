import { DateTime } from 'luxon'
import {compose} from "@ioc:Adonis/Core/Helpers"
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import {v4 as uuid} from "uuid"
import { BaseModel, BelongsTo, HasMany, beforeCreate, belongsTo, column, computed, hasMany } from '@ioc:Adonis/Lucid/Orm'
import MasterSekolah from './MasterSekolah'
import TrxLine from './TrxLine'

export default class Trx extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid:string

  @column()
  public masterSekolahUuid:string

  @column()
  public implementationAt:String

  @column()
  public deletedAt:DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async createUUID(trx:Trx){
    trx.uuid = uuid()
  }

  @belongsTo(()=> MasterSekolah, {foreignKey: "masterSekolahUuid", localKey:"uuid"})
  public sekolah: BelongsTo<typeof MasterSekolah>

  @hasMany(()=> TrxLine, {localKey:"uuid", foreignKey:"trxUuid"})
  public trxlines: HasMany<typeof TrxLine>


  @computed()
  public get datadisplay(){
    return{
      id: this.uuid,
      implementation_at: DateTime.fromJSDate( this.implementationAt).toFormat("dd/MM/yyyy")
    }
  }

  @computed()
  public get datarecord(){
    return{
      id: this.uuid,
      master_sekolah_uuid: this.masterSekolahUuid,
      implementation_at: this.implementationAt

    }
  }
}
