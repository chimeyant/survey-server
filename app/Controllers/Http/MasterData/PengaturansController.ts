import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PengaturanService from 'App/Services/PengaturanService'
import Ws from 'App/Services/Ws'


export default class PengaturansController {
  public async index({auth}: HttpContextContract) {
    const user = auth.user
    const service = new PengaturanService

    return service.list(user?.id,user?.authent)

  }

  public async create({}: HttpContextContract) {}

  public async store({request,response, auth}: HttpContextContract) {
    const user = auth.user

    const payload = request.only(['name','phone_number','queue','callback_url','status'])

    const service = new PengaturanService

    const result = await service.store(payload, user?.id)

    Ws.io.emit("news",{hello: "Data tersimpan"})

    return response.send(result)
  }

  public async show({params}: HttpContextContract) {
    const service = new PengaturanService

    return service.show(params.id)
  }

  public async edit({}: HttpContextContract) {}

  public async update({params, request, response}: HttpContextContract) {
    const payload = request.only(['name','phone_number','queue','callback_url','status'])

    const service = new PengaturanService

    const result = await service.update(payload, params.id)

    return response.send(result)
  }

  public async destroy({params, response}: HttpContextContract) {
    const service = new PengaturanService

    const result = await service.delete(params.id)

    return response.send(result)
  }

  public async register({request, auth}:HttpContextContract){
    const user = auth.user
    const {phone_number} = request.all()

    const service = new PengaturanService

    const result = service.register(phone_number, user?.email)

    return result;
  }
  public async combo({auth}:HttpContextContract){
    const user = auth.user
    const service = new PengaturanService

    return service.combo(user.id)
  }
}
