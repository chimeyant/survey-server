import { DELETED_SUCCESS, SOMETHING_WRONG, STORE_SUCCESS, UPDATE_SUCCESS } from "App/Helpers/Languange";
import Pengaturan from "App/Models/Pengaturan";
import WhatsappService from "./WhatsappService";


interface PengaturanInterface{
  name:string,
  phone_number:string,
  queue:number,
  callback_url:string,
  status:number,
}

class PengaturanService {
  async list(user_uuid:string, authent:string){
    if(authent== 'superadmin'){
      const model = await Pengaturan.query().orderBy("id",'asc')
      const datas:{}[]=[]

      model.forEach(element => {
        const row ={}
        row['id']= element.uuid
        row['name']= element.name
        row['phone_number']= element.phoneNumber
        row['status']= element.status == 1 ? {color:'grey', text:'Pending'} : element.status == 2? {color:'green',text:"Aktif"}: {color:'red',text:'Tidak Aktif'}
        datas.push(row)
      });

      return  datas;

    }else{
      const model = await Pengaturan.query().where("user_uuid",user_uuid).orderBy("id",'asc')
      const datas:{}[]=[]

      model.forEach(element => {
        const row ={}
        row['id']= element.uuid
        row['name']= element.name
        row['phone_number']= element.phoneNumber
        row['status']= element.status == 1 ? {color:'grey', text:'Pending'} : element.status == 2? {color:'green',text:"Aktif"}: {color:'red',text:'Tidak Aktif'}
        datas.push(row)
      });

      return  datas;
    }
  }

  async store(payload:PengaturanInterface, user_uuid:string){
    try {

      const model = new Pengaturan
      model.name = payload.name
      model.userUuid = user_uuid
      model.phoneNumber = payload.phone_number
      model.queue= payload.queue,
      model.callbackUrl= payload.callback_url
      model.status = 2
      await model.save()

      return{
        code:200,
        success:true,
        message: STORE_SUCCESS,
        data:model.datadisplay
      }

    } catch (error) {
      return {
        code:500,
        success:false,
        message:SOMETHING_WRONG,
        error:error
      }
    }
  }

  async show(id:string){
    try {
      const model = await Pengaturan.findBy("uuid", id)

      return model?.datarecord
    } catch (error) {

    }
  }

  async update(payload: PengaturanInterface, id:string){
    try {
      const model = await Pengaturan.findBy("uuid", id)
      model?.merge({
        name: payload.name,
        phoneNumber: payload.phone_number,
        queue: payload.queue,
        callbackUrl: payload.callback_url,
        status: payload.status,
      })
      await model?.save()

      return {
        code:200,
        success: true,
        message:UPDATE_SUCCESS,
        data: model?.datadisplay
      }
    } catch (error) {
      return {
        code:500,
        success:false,
        message:SOMETHING_WRONG,
        error:error
      }
    }
  }

  async delete(id:string){
    try {
      const model = await Pengaturan.findBy("uuid",id)
      await model?.delete()

      return {
        code:200,
        success:true,
        message:DELETED_SUCCESS,
        data:{id:id}
      }
    } catch (error) {
      return {
        code:500,
        success:false,
        message:SOMETHING_WRONG,
        error:error
      }
    }
  }

  async register(phonenumber:any, username:string){
    const waservice = new WhatsappService
    await waservice.boot(phonenumber,username)
  }

  async combo(userId:string){
    const model = await Pengaturan.query().where('user_uuid',userId).orderBy("id",'asc')

    const datas:{}[]=[]

    model.forEach(element => {
      const row ={}
      row['value']= element.phoneNumber
      row['text']= element.name + "|"+ element.phoneNumber
      datas.push(row)
    });

    return datas;
  }

  async showByApiKey(apiKey:string){
    const model = await Pengaturan.findBy("api_key",apiKey)

    return model?.datarecord;
  }

}


export default PengaturanService
