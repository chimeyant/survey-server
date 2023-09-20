import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MasterTypeService from 'App/Services/MasterData/MasterTypeService'
import MasterTypeValidator from 'App/Validators/MasterData/MasterTypeValidator'

export default class MasterTypesController {
  protected Service = MasterTypeService

  public async index({}: HttpContextContract) {
    const result = await this.Service.fetch()

    return result
  }

  public async create({}: HttpContextContract) {}

  public async store({request, response}: HttpContextContract) {
    const payload = request.only(['name'])

    await request.validate(MasterTypeValidator)

    const result = await this.Service.store(payload)

    return response.status(result.code).send(result)
  }

  public async show({params}: HttpContextContract) {
    const result = await this.Service.show(params.id)

    return result
  }

  public async edit({}: HttpContextContract) {}

  public async update({params, request, response}: HttpContextContract) {
    const payload = request.only(['name'])

    await request.validate(MasterTypeValidator)

    const result = await this.Service.update(payload, params.id)

    return response.status(result.code).send(result)
  }

  public async destroy({params, response}: HttpContextContract) {
    const result = await this.Service.delete(params.id)

    return response.status(result.code).send(result)
  }
}
