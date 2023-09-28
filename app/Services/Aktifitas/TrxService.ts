import Database from "@ioc:Adonis/Lucid/Database"
import { MSG_DELETED_SUCCESS, MSG_ERROR, MSG_STORE_SUCCESS } from "App/Helpers/Languange"
import Trx from "App/Models/Trx"

export type TrxType ={
  master_sekolah_uuid:any,
  implementation_at:string,
  trxlines:[
    {
      id:any,
      master_type_uuid:any,
      tidak_sesuai:any,
      sesuai:any,
      sangat_sesuai:any
    }
  ]
}

class TrxService {
  protected DB = Database
  protected Model = Trx

  async lists(){
    const model = await this.Model.query().preload("sekolah").orderBy("id",'desc')

    const datas:{}[]=[]

    model.forEach(element => {
      const row = {}
      Object.assign(row, element.datadisplay, {sekolah: element.sekolah.name})
      datas.push(row)
    });

    return datas;
  }

  async store(payload: TrxType){
    try {
      const result = await this.DB.transaction(async (trx)=>{

        const model = new this.Model
        model.masterSekolahUuid = payload.master_sekolah_uuid
        model.implementationAt= payload.implementation_at
        model.useTransaction(trx)
        await model.save()

        const datas:{}[]=[]

        payload.trxlines.forEach(element => {
          const row ={}
          row['trx_uuid']= model.uuid
          row['master_type_uuid']= element.master_type_uuid,
          row['master_question_uuid']= element.id,
          row['tidak_sesuai']= element.tidak_sesuai.nilai
          row['sesuai']= element.sesuai.nilai,
          row['sangat_sesuai']= element.sangat_sesuai.nilai
          datas.push(row)
        });

        await model.related("trxlines").createMany(datas)


        await model.preload("sekolah")
        const data =  model.datadisplay

        Object.assign(data,{sekolah:model.sekolah.name})
        return{
          code:200,
          success:true,
          message:MSG_STORE_SUCCESS,
          data: data
        }

      })

      return result

    } catch (error) {
      return{
        code:500,
        success:false,
        messsage:MSG_ERROR,
        error:error
      }
    }
  }

  async show(id:string){
    const model = await this.Model.query().preload("trxlines").where("uuid",id).first()

    return model?.datarecord
  }

  async update(){

  }

  async delete(id:string){
    try {
      const model = await this.Model.findBy("uuid",id)
      await model?.related("trxlines").query().delete()

      await model?.delete()

      return{
        code:200,
        success:true,
        message:MSG_DELETED_SUCCESS,
        data:{id:id}
      }
    } catch (error) {
      return {
        code:200,
        success:false,
        message:MSG_ERROR,
        error:error
      }
    }
  }


}

export default new TrxService
