 import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginController {
  public async login({request,response, auth}: HttpContextContract){
    const {email, password}= request.all()
    try {
      const token = await auth.use("api").attempt(email,password, {expiresIn:"720mins"})

      return response.status(200).json({
        code :200,
        success:true,
        message:"Login Succesed",
        token: token
      });
    } catch (error) {
      return response.send("Invalid credential..!" + error)
    }
  }
}
