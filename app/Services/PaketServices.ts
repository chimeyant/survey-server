import { DELETED_SUCCESS, SOMETHING_WRONG, STORE_SUCCESS, UPDATE_SUCCESS } from "App/Helpers/Languange";
import Paket from "App/Models/Paket"

interface PaketInterface{
  name:string,
  description:string,
  price:number
}

class PaketService {

  async list(){
    const model = await Paket.query().orderBy("price",'desc')

    const datas:{}[]=[]

    model.forEach(element => {
      const row ={}
      row['id']= element.uuid
      row['name']= element.name
      row['description']= element.description
      row['price'] = element.price
      datas.push(row)
    });

    return datas;
  }

  async store(payload:PaketInterface){
    try {
      const model = new Paket
      model.name = payload.name
      model.description = payload.description
      model.price = payload.price
      await model.save()

      return {
        code:200,
        success:true,
        message:STORE_SUCCESS,
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
      const model = await Paket.findBy("uuid",id)
      return model?.datarecord
    } catch (error) {

    }
  }

  async update(payload:PaketInterface, id:string){
    try {
      const model = await Paket.findBy("uuid",id)
      model?.merge({name:payload.name, description:payload.description, price: payload.price})
      await model?.save()

      return {
        code:200,
        success:true,
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
      const model = await Paket.findBy("uuid",id)
      await model?.delete()

      return {
        code:200,
        success:false,
        message: DELETED_SUCCESS,
        data:{id:id}
      }
    } catch (error) {
      return{
        code:500,
        success:false,
        messaage: SOMETHING_WRONG,
        error:error
      }
    }
  }
}

export default PaketService
