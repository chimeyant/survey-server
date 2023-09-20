import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import OutboxService from 'App/Services/Pesan/OutboxService'
import OutboxValidator from 'App/Validators/Pesan/OutboxValidator'

export default class OutboxesController {
  public async index({auth}: HttpContextContract) {
    const user = auth.user
    const service = new OutboxService

    return service.lists(user?.id, user?.authent)
  }

  public async create({}: HttpContextContract) {}

  public async store({request, response,auth}: HttpContextContract) {
    const user = auth.user
    const {sender_number, recieve_number, type, content}= request.all()

    await request.validate(OutboxValidator)

    const payload=  {
      userUuid: user?.id,
      userName: user?.email,
      senderNumber: sender_number,
      recieveNumber: recieve_number,
      type: type,
      content: content,
      process:"now",
      api:false
    }


    const service = new OutboxService
    const result = await service.store(payload)

    return response.send(result)
  }

  public async show({params}: HttpContextContract) {
    const service = new OutboxService
    return service.show(params.id)
  }

  public async edit({}: HttpContextContract) {}

  public async update({params, request, response}: HttpContextContract) {
    const payload = request.only(['sender_number','recieve_number','content','type','process'])

    const service = new OutboxService

    const result = await service.update(payload, params.id)

    return response.send(result)
  }

  public async destroy({params, response}: HttpContextContract) {
    const {id}= params

    const service = new OutboxService

    const result = await service.delete(id)

    return response.send(result)
  }

  public async bulkDestroy(auth, response){
    const user = auth.user_id

    const service = new OutboxService
    const result = await service.bulkDelete(user.id)

    return response.send(result)
  }
}
