import Env from "@ioc:Adonis/Core/Env"
import Axios from "axios"


class Whatsapp{
  async sendMessage(recieveNumber:string, message:string ){
    const data = {
      apiKey: Env.get("WA_API_KEY"),
      recieveNumber: recieveNumber,
      message: message
    }
    await Axios.post("https://api.senderwa.com/api/v2/send-message", data);
  }

}
export default new Whatsapp
