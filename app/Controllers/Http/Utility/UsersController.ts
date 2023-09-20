import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "App//Models/User"
import UserValidator from 'App/Validators/MasterData/UserValidator'
import UpdateProfilValidator from 'App/Validators/Utility/UpdateProfilValidator'
import Env from "@ioc:Adonis/Core/Env"
import Drive from "@ioc:Adonis/Core/Drive"




export default class UsersController {
  public async index({request}: HttpContextContract) {
    const {page, itemsPerPage}= request.only(['page','itemsPerPage'])

    const users = await User.query().withScopes((scopes)=> scopes.filterOn(request)).paginate(page,itemsPerPage)

    return users;
  }

  public async create({}: HttpContextContract) {}

  public async store({request,response}: HttpContextContract) {
    const {name, email, password, authent,status,reset, opd_uuid} = request.all()

    await request.validate(UserValidator)

    try {
      const user = new User()
      user.name = name
      user.email = email
      user.password = "12345678"
      user.authent = authent
      user.status = status
      await user.save()

      return response.json({
        status:true,
        message:"Tambah pengguna berhasil..!"
      })
    } catch (error) {
      return response.json({
        status: false,
        message:"Opps..., terjadi kesalahan "+ error
      })
    }
  }

  public async show({params}: HttpContextContract) {
    const {id}= params
    const user = await User.query().select('id','name','email','authent','status','opd_uuid').where('id',id).first()

    const data={}
    data['id']= user?.id
    data['name']= user?.name
    data['email']= user?.email
    data['authent']= user?.authent
    data['status']= user?.status
    data['opd_uuid']= user?.opdUuid
    return data;
  }

  public async edit({}: HttpContextContract) {}

  public async update({params, request,response}: HttpContextContract) {
    const {id}= params

    const {name,status,authent,opd_uuid, reset}= request.all()

    await request.validate(UserValidator)

    try {
      const user = await User.findOrFail(id)
      user.name = name
      user.authent= authent
      user.opdUuid = opd_uuid
      user.status = status
      if(reset){
        user.password = "12345678"
      }
      await user?.save()

      return response.json({
        status:true,
        message:"Proses ubah data berhasil"
      })
    } catch (error) {
      return response.json({
        status:false,
        message:"Opps..., terjadi kesalahan "+ error
      })
    }
  }

  public async destroy({params,response}: HttpContextContract) {
    const {id}= params
    try {
      const user = await User.findBy('id',id)
      await user?.delete()
      return response.status(200).json({
        success:true,
        code:200,
        response:{
          message:"Proses hapus data berhasil...",
          data:{
            id:id
          }
        }
      })
    } catch (error) {
      return response.status(500).json({
        success:false,
        code:500,
        response:{
          message:"Opps..., terjadi kesalahan ",
          data:{}
        },
        errors:error
      })
    }
  }

  public async userInfo({auth}: HttpContextContract){
    const user = await auth.user;
    const data ={}
    data['id']= user?.id
    data['name']= user?.name
    data['email']= user?.email
    data['authent']= user?.authent
    data['avatar']= user?.avatar
    data['avatar_path'] = user?.avatar ? Env.get("BASE_URL")+ await Drive.getSignedUrl( "images/avatars/"+ user?.avatar):   "/images/pencaker.png"
    return data;
  }

  public async updateProfil({request,response,auth}:HttpContextContract){
    const user = await auth.user
    const data = request.only(['name','avatar']);


    //validasi form
    await request.validate(UpdateProfilValidator)

    try {
      const profil = await User.findBy("id", user?.id)
      profil?.merge(data)
      await profil?.save()

      return response.json({
        status:true,
        message:"Proses ubah profil berhasil..."
      })
    } catch (error) {
      return response.json({
        status:false,
        message: "Opps..., terjadi kesalahan "+ error
      })
    }
  }

  public async changePwd({request,response,auth}:HttpContextContract){
    const authuser = await auth.user
    const data = request.only(['password']);
    try {
      const user = await User.findBy('id', authuser?.id)
      user?.merge(data)
      await user?.save()

      return response.json({
        status:true,
        message:"Proses ubah kata sandi berhasil..."
      })
    } catch (error) {
      return response.json({
        status:false,
        message:"Opps..., terjadi kesalahan "+ error
      })
    }
  }
}
