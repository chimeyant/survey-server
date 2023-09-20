// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Whatsapp from 'App/Helpers/Whatsapp'
import RegistrasiUserValidator from 'App/Validators/Auth/RegistrasiUserValidator'


export default class RegisterUsersController {
    public async registrasi({request,response}: HttpContextContract){
        const {name, email, password, phone}= request.all()
        await request.validate(RegistrasiUserValidator)

        try {

          const user = new User
          user.name = name
          user.email = email
          user.password = password
          user.authent = 'user'
          user.phone = phone
          await user.save()

          //kirim pesan wa
          const pesan = "*SINIKMAT LANTAS* \r\n `Nikmati Layanan Nyaman Bersama DISHUB Kab. Tangerang` \r\n\r\nHalo... \r\n"+ user.name.toUpperCase() + "\r\n\r\nSelamat Anda telah terdaftar sebagai akun pengguna pada sistem kami dengan data akun sebagai berikut :"+ "\r\nNama pengguna :  "+ email + "\r\nKata Sandi :  "+password+" \r\n\r\nSelanjutnya, untuk dapat melakukan pelaporan dan lainnya silahkan masuk di sistem kami \r\n\r\nSalam, \r\n\r\nSINIKMAT LANTAS \r\nKabupaten Tangerang"

          //send message
          await Whatsapp.sendMessage(user.phone, pesan)

          return response.status(200).json({
            code :200,
            success:true,
            message:"Proses registrasi berhasil..."
          })

        } catch (error) {
          return response.status(501).json({
            code:501,
            success:false,
            errors:[
              {
                message: "Opps..., terjadi kesalahan "+ error,
              }
            ]
          })
        }
      }

}
