import { MSG_DELETED_SUCCESS, MSG_ERROR, MSG_STORE_SUCCESS, MSG_UPDATE_SUCCESS } from "App/Helpers/Languange"
import MasterSekolah from "App/Models/MasterSekolah"

export type MasterSekolahType = {
  name:string,
  alamat:string
}

class MasterSekolahService {
  protected Model = MasterSekolah
  async fetch(){
    const model = await this.Model.query().orderBy("name",'asc')

    const datas:{}[]=[]

    model.forEach(element => {
      datas.push(element.datadisplay)
    });

    return datas
  }

  async store(payload:MasterSekolahType){
    try {
      const model = new this.Model
      model.name = payload.name
      model.alamat = payload.alamat
      await model.save()

      return{
        code:200,
        success:true,
        message:MSG_STORE_SUCCESS,
        data: model.datadisplay
      }
    } catch (error) {
      return {
        code : error.response.status,
        success: false,
        message:MSG_ERROR,
        error:error
      }
    }
  }

  async show(id:any){
    const model = await this.Model.findBy("uuid",id)

    return model.datarecord
  }

  async update(payload: MasterSekolahType,id:any){
    try {
      const model = await this.Model.findBy("uuid",id)
      model.merge({
        name:payload.name,
        alamat: payload.alamat
      })

      await model.save()

      return{
        code:200,
        success:true,
        message:MSG_UPDATE_SUCCESS,
        data: model.datadisplay
      }
    } catch (error) {
      return{
        code: error.response.status,
        success:false,
        message:MSG_ERROR,
        error: error
      }
    }
  }

  async delete(id:any){
    try {
      const model = await this.Model.findBy("uuid",id)
      await model.delete()

      return{
        code:200,
        success:true,
        message:MSG_DELETED_SUCCESS,
        data:{id:id}
      }
    } catch (error) {
      return{
        code:error.response.status,
        success:false,
        message:MSG_ERROR
      }
    }
  }

  async bulkdelete(ids:[]){
    try {
      await this.Model.query().whereIn("uuid", ids).delete()

      return {
        code :200,
        success:true,
        message:MSG_DELETED_SUCCESS,
        data:{ids}
      }

    } catch (error) {
      return {
        code:error.response.status,
        success:false,
        message:MSG_ERROR,
        error:error
      }
    }
  }
}

export default new MasterSekolahService
