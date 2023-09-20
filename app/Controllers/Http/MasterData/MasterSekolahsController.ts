import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MasterSekolahService from 'App/Services/MasterData/MasterSekolahService'
import MasterSekolahValidator from 'App/Validators/MasterData/MasterSekolahValidator'

export default class MasterSekolahsController {
  protected Service = MasterSekolahService

  public async index({}: HttpContextContract) {
    const results = await this.Service.fetch()

    return results
  }

  public async create({}: HttpContextContract) {}

  public async store({request, response}: HttpContextContract) {
    const {name,alamat}=  request.all()

    await request.validate(MasterSekolahValidator)

    const payload ={
      name: name,
      alamat: alamat
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
    const payload = request.only(['name','alamat'])

    await request.validate(MasterSekolahValidator)

    const result = await this.Service.update(payload, params.id)

    return response.status(result.code).send(result)
  }

  public async destroy({params, response}: HttpContextContract) {
    const result = await this.Service.delete(params.id)

    return response.status(result.code).send(result)
  }
}
