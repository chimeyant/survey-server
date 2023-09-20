import { MSG_DELETED_SUCCESS, MSG_ERROR, MSG_STORE_SUCCESS } from "App/Helpers/Languange"
import MasterQuestion from "App/Models/MasterQuestion"

export type MasterQuestionType={
  master_type_uuid:string,
  question: string,
  status: boolean
}
class MasterQuestionService {
  protected Model = MasterQuestion
  async lists(master_type_uuid:any){
    const model = await this.Model.query().where('master_type_uuid',master_type_uuid).orderBy("id",'asc')

    const datas:{}[]=[]

    model.forEach(element => {
      datas.push(element.datadisplay)
    });

    return datas;
  }

  async store(payload:MasterQuestionType){
    try {
      const model = new this.Model
      model.masterTypeUuid = payload.master_type_uuid
      model.question= payload.question
      model.status = payload.status
      await model.save()

      return{
        code:200,
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
    const model = await this.Model.findBy('uuid', id)

    return model?.datarecord
  }

  async update(payload:MasterQuestionType, id:any){
    try {
      const model = await this.Model.findBy("uuid",id)
      model?.merge({
        masterTypeUuid: payload.master_type_uuid,
        question: payload.question,
        status: payload.status
      })
      await model?.save()

      return{
        code:200,
        success:true,
        message:MSG_STORE_SUCCESS,
        data: model?.datadisplay
      }
    } catch (error) {
      return{
        code: error.response.status,
        success:false,
        message:MSG_ERROR,
        error:error
      }
    }
  }

  async delete(id:any){
    try {
      const model = await this.Model.findBy("uuid", id)
      await model?.delete()

      return{
        code:200,
        success:true,
        message:MSG_DELETED_SUCCESS,
        data:{
          id:id
        }
      }
    } catch (error) {
      return{
        code:500,
        success:false,
        message:MSG_ERROR,
        error:error
      }
    }

  }
}

export default new MasterQuestionService
