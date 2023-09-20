import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PaketService from 'App/Services/PaketServices'
import PaketValidator from 'App/Validators/MasterData/PaketValidator'

export default class PaketsController {
  public async index({}: HttpContextContract) {
    const service = new PaketService

    return service.list()
  }

  public async create({}: HttpContextContract) {}

  public async store({request, response}: HttpContextContract) {
    const payload = request.only(['name','description','price'])

    //validate
    await request.validate(PaketValidator)

    const service = new PaketService
    const result = await service.store(payload)

    return response.send(result)
  }

  public async show({params, response}: HttpContextContract) {
    const service = new PaketService

    return response.send(await service.show(params.id))
  }

  public async edit({}: HttpContextContract) {}

  public async update({params, request, response}: HttpContextContract) {
    const payload = request.only(['name','description','price'])

    await request.validate(PaketValidator)

    const service = new PaketService

    const result = await service.update(payload,params.id)

    return response.send(result)
  }

  public async destroy({params, response}: HttpContextContract) {
    const service = new PaketService

    const result = await service.delete(params.id)

    return response.send(result)
  }
}
