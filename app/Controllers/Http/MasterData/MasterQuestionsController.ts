import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MasterQuestionService from 'App/Services/MasterData/MasterQuestionService'
import MasterQuestionValidator from 'App/Validators/MasterData/MasterQuestionValidator'

export default class MasterQuestionsController {
  protected Service = MasterQuestionService

  public async index({params}: HttpContextContract) {
    const result = await this.Service.lists(params.master_type_uuid)

    return result
  }

  public async create({}: HttpContextContract) {}

  public async store({params,request, response}: HttpContextContract) {
    const {question, status} = request.all()

    await request.validate(MasterQuestionValidator)

    const payload={
      master_type_uuid: params.master_type_uuid,
      question: question,
      status: status
    }

    const result = await this.Service.store(payload)

    return response.status(result.code).send(result)
  }

  public async show({params}: HttpContextContract) {
    const result = await this.Service.show(params.id)

    return result
  }

  public async edit({}: HttpContextContract) {}

  public async update({params, request, response}: HttpContextContract) {
    const {question, status}= request.all()

    await request.validate(MasterQuestionValidator)

    const payload={
      master_type_uuid: params.master_type_uuid,
      question: question,
      status: status
    }

    const result = await this.Service.update(payload, params.id)

    return response.status(result.code).send(result)
  }

  public async destroy({params, response}: HttpContextContract) {
    const result = await this.Service.delete(params.id)

    return response.status(result.code).send(result)
  }

  public async listalls({}:HttpContextContract){
    const result = await this.Service.listalls()

    return result;
  }
}
