import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Slider from "App/Models/Slider"
import SliderValidator from 'App/Validators/HalamanDepan/SliderValidator';
import Env from "@ioc:Adonis/Core/Env"
import Drive from "@ioc:Adonis/Core/Drive"

export default class SlidersController {
  public async index({}: HttpContextContract) {
    const sliders = await Slider.query().select('id','title','status','content').orderBy('id','desc')

    return sliders;
  }

  public async create({}: HttpContextContract) {}

  public async store({request,response}: HttpContextContract) {
    const {title, subtitle, content, path,  status} = request.all()

    await request.validate(SliderValidator)

    try {
      const slider = new Slider()
      slider.title = title
      slider.subtitle = subtitle
      slider.content = content
      slider.path = path
      slider.status = status
      await slider.save()

      return response.json({
        status:true,
        message:"Proses tambah slider berhasil..."
      })
    } catch (error) {
      return response.json({
        status:false,
        messsage:"Opps..., terjadi kesalahan "+ error
      })
    }
  }

  public async show({params,request,response}: HttpContextContract) {
    const {id}= params
    const slider = await Slider.findBy('id',id)

    const data = {
      id: slider?.id,
      title: slider?.title,
      subtitle: slider?.subtitle,
      content: slider?.content,
      path:slider?.path,
      path_url: Env.get("BASE_URL")+ await Drive.getSignedUrl( "images/sliders/"+ slider?.path),
      status: slider?.status,
    }

    return data;
  }

  public async edit({}: HttpContextContract) {}

  public async update({params, request,response}: HttpContextContract) {
    const {id} = params
    const {title, subtitle, content,path, status}= request.all()



    await request.validate(SliderValidator)

    try {
      const slider = await Slider.findBy('id',id)
      slider?.merge({title:title, subtitle:subtitle, content:content, path:path, status:status})
      await slider?.save()

      return response.json({
        status: true,
        message:"Proses ubah data berhasil..."
      })

    } catch (error) {
      return response.json({
        status:false,
        message:"Opps..., terjadi kesalahan "+ error
      })
    }


  }

  public async destroy({params, response, request}: HttpContextContract) {
    const {id}= params

    try {
      const slider = await Slider.findBy('id',id)
      await slider?.delete()
      return response.json({
        status:true,
        message:"Proses hapus data berhasil..."
      })
    } catch (error) {
      return response.json({
        status:false,
        message:"Opps..., terjadi kesalahan "+ error
      })
    }

  }

  public async publish({}:HttpContextContract){
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
}
