import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MESSAGE_FORBIDDEN, SOMETHING_WRONG } from 'App/Helpers/Languange'
import PengaturanService from 'App/Services/PengaturanService'
import OutboxService from 'App/Services/Pesan/OutboxService'
import UserService from 'App/Services/UserService'
import SendMessageValidator from 'App/Validators/Api/SendMessageValidator'

export default class SendMessagesController {
  async sendMessage({request, response}:HttpContextContract){
    const {apiKey, recieveNumber, message}= request.all()

    await request.validate(SendMessageValidator)

    const service = new PengaturanService

    const pengaturan  = await service.showByApiKey(apiKey)

    const userSvc = new UserService

    const user =await userSvc.getByUuid(pengaturan?.user_id)

    if(pengaturan){
      const payload = {
        userUuid: user.id,
        userName: user.email,
        senderNumber: pengaturan.phone_number,
        recieveNumber: recieveNumber,
        content: message,
        type: 'text',
        process:'now',
        api:true,
      }

      const outboxsvc = new OutboxService
      const result =  await outboxsvc.storeFromApiService(payload)

      return response.accepted(result)
    }else{
      return response.forbidden({
        code: 403,
        success:false,
        message:MESSAGE_FORBIDDEN
      })
    }
  }

  async sendBulkMessage({request, response}:HttpContextContract){
    try {
      const {apiKey, datas} = request.all()


      //chek apiKey Validator
      const pengaturanSvc = new PengaturanService

      const pengaturan = await pengaturanSvc.showByApiKey(apiKey)

      const userSvc = new UserService

      const user = await userSvc.getByUuid(pengaturan?.user_id)

      //save to outbox
      const outboxSvc = new OutboxService
      const result = await outboxSvc.bulkStoreFromApiService(datas, pengaturan?.phone_number, user.id, user?.name)

      return response.status(200).send(result)

    } catch (error) {
      return response.forbidden({
        code:403,
        success:false,
        message:MESSAGE_FORBIDDEN,
        error:error
      })
    }
  }



  async sendMessageSendBox({request, response}:HttpContextContract){
    const {apiKey, recieveNumber, message}= request.all()

    await request.validate(SendMessageValidator)

    const service = new PengaturanService

    const pengaturan  = await service.showByApiKey(apiKey)

    const userSvc = new UserService

    const user =await userSvc.getByUuid(pengaturan?.user_id)

    if(pengaturan){
      const payload = {
        userUuid: user.id,
        userName: user.email,
        senderNumber: pengaturan.phone_number,
        recieveNumber: recieveNumber,
        content: message,
        type: 'text',
        process:'now',
        api:true,
      }

      const outboxsvc = new OutboxService
      const result =  await outboxsvc.storeFromApiServiceSendBox(payload)

      return response.accepted(result)
    }else{
      return response.forbidden({
        code: 403,
        success:false,
        message:MESSAGE_FORBIDDEN
      })
    }
  }

  async sendBulkMessageSendBox({request, response}:HttpContextContract){
    try {
      const {apiKey, datas} = request.all()


      //chek apiKey Validator
      const pengaturanSvc = new PengaturanService

      const pengaturan = await pengaturanSvc.showByApiKey(apiKey)

      const userSvc = new UserService

      const user = await userSvc.getByUuid(pengaturan?.user_id)

      //save to outbox
      const outboxSvc = new OutboxService
      const result = await outboxSvc.bulkStoreFromApiServiceSendBox(datas, pengaturan?.phone_number, user.id, user?.name)

      return response.status(200).send(result)

    } catch (error) {
      return response.forbidden({
        code:403,
        success:false,
        message:MESSAGE_FORBIDDEN,
        error:error
      })
    }
  }

}
