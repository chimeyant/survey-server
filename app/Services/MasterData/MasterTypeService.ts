import { MSG_DELETED_SUCCESS, MSG_ERROR, MSG_STORE_SUCCESS, MSG_UPDATE_SUCCESS } from "App/Helpers/Languange"
import MasterType from "App/Models/MasterType"

export type MasterTypeType={
  name:string
}
class MasterTypeService {
  protected Model = MasterType

  async fetch(){
    const model = await this.Model.query().orderBy("id",'asc')

    const datas:{}[]=[]

    model.forEach(element => {
      datas.push(element.datadisplay)
    });

    return datas
  }

  async store(payload:MasterTypeType){
    try {
      const model = new this.Model
      model.name = payload.name
      await model.save()

      return{
        code :200,
        success:true,
        message:MSG_STORE_SUCCESS,
        data: model.datadisplay
      }
    } catch (error) {
      return{
        code:error.response.status,
        success:false,
        message:MSG_ERROR,
        error:error
      }
    }
  }

  async show(id:any){
    const model = await this.Model.findBy("uuid", id)

    return model?.datarecord
  }

  async update(payload:MasterTypeType, id:any){
    try {
      const model = await this.Model.findBy("uuid", id)
      model?.merge({
        name: payload.name
      })

      await model?.save()

      return{
        code: 200,
        success:true,
        message:MSG_UPDATE_SUCCESS,
        data: model?.datadisplay
      }
    } catch (error) {
      return{
        code:error.response.status,
        success:true,
        message:MSG_ERROR,
        error:error
      }
    }
  }

  async delete(id:any){
    try {
      const model = await this.Model.findBy("uuid",id)
      await model?.delete()

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
        message:MSG_ERROR,
        error:error
      }
    }
  }
}

export default new MasterTypeService
