import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ContactService from 'App/Services/MasterData/ContactService'

export default class ContactsController {
  public async index({auth}: HttpContextContract) {
    const user = auth.user

    const service = new ContactService

    return service.list(user.id)
  }

  public async create({}: HttpContextContract) {}

  public async store({request, response, auth}: HttpContextContract) {
    const user = auth.user

    const payload = request.only(['name','phone','status'])

    const service = new ContactService

    const result = await service.store(payload, user?.id)

    return response.status(result.code).send(result)
  }

  public async show({params}: HttpContextContract) {
    const service = new ContactService

    return service.show(params.id)
  }

  public async edit({}: HttpContextContract) {}

  public async update({params, request, response}: HttpContextContract) {
    const {id}= params

    const payload = request.only(['name','phone','status'])

    const service = new ContactService

    const result = await service.update(payload, id)

    return response.status(result.code).send(result)
  }

  public async destroy({params, response}: HttpContextContract) {
    const {id}= params

    const service = new ContactService

    const result = await service.delete(id)

    return response.status(result.code).send(result)
  }

  public async combo({auth}:HttpContextContract){
    const user = auth.user
    const service = new ContactService

    return service.combo(user.id)
  }
}
