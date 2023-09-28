import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TrxService from 'App/Services/Aktifitas/TrxService'

export default class TrxesController {
  protected Service = TrxService

  public async index({}: HttpContextContract) {
    const result = await TrxService.lists()

    return result
  }

  public async create({}: HttpContextContract) {}

  public async store({request, response}: HttpContextContract) {
    const {master_sekolah_uuid, implementation_at, trxlines} = request.all()

    const payload={
      master_sekolah_uuid: master_sekolah_uuid,
      implementation_at: implementation_at,
      trxlines: trxlines
    }

    const result = await this.Service.store(payload)

    return response.status(result?.code).send(result)
  }

  public async show({params}: HttpContextContract) {
    const result = await this.Service.show(params.id)

    return result

  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {
  }

  public async destroy({params, response}: HttpContextContract) {
    const result = await this.Service.delete(params.id)

    return response.status(result.code).send(result)
  }
}
