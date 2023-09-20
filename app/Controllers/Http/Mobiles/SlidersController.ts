import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Slider from 'App/Models/Slider'
import Drive from "@ioc:Adonis/Core/Drive"
import Env from "@ioc:Adonis/Core/Env"

export default class SlidersController {
  public async index({}: HttpContextContract) {
    const sliders = await Slider.query().where('status',true).orderBy('id','desc')

    const datas: {}[]=[];

    sliders.forEach(async (item)=>{
      const row ={}
      const url = await Drive.getSignedUrl("images/sliders/"+ item.path)
      row['id']= item.id
      row['title']= item.title
      row['subtitle']=item.subtitle
      row['content']= item.content
      row['path']= Env.get("BASE_URL")+ url
      datas.push(row)
    })

    return datas;
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
