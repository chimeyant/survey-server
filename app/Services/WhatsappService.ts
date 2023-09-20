import makeWASocket, { AnyMediaMessageContent, DisconnectReason, SignalDataSet, SignalDataTypeMap, delay, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, makeInMemoryStore, useMultiFileAuthState } from "@whiskeysockets/baileys";
import Ws from "./Ws";
import  QRCode  from "qrcode";
import Env from "@ioc:Adonis/Core/Env"



class WhatsappService {
  public sock;

  public booted = false

  async boot(phonenumber:any, username:string){
    const auth_folder = Env.get("NODE_ENV") == "production" ? "../wa_auth/" : "./wa_auth/"
    const {state, saveCreds}= await useMultiFileAuthState( auth_folder + phonenumber )
    //lihat verisi terakhir wa web
    const {version, isLatest} = await fetchLatestBaileysVersion()

    try {
      this.sock = makeWASocket({
        version,
        auth:{
          creds: state.creds,
          keys:state.keys
        },
        printQRInTerminal:false,
        syncFullHistory:false,

      })

      this.sock.ev.process(
        async (events)=>{
          if(events['connection.update']){
            const update = events['connection.update'];
            const {connection, lastDisconnect, qr}= update

            if(connection==='close'){
              console.log('reconect if not logoute')
              if(this.booted == false){
                this.boot(phonenumber, username)
              }
            }
            else if(connection === "open"){
              this.booted = true

              Ws.io.emit(username + ":authenticated",{
                id: this.sock.user.id,
                name: this.sock.user.name,
                image:"/images/ok.png",
                status:"Terhubung....!",
                show:true
              });
            }
            else{
              if(qr){
                QRCode.toDataURL(qr).then((url)=>{
                  Ws.io.emit(username +":qr",{
                    id:phonenumber,
                    src:url,
                    show:true,
                    message:"Silahkan Scan Barcode...!"
                  });
                })
              }

              console.log('Connection closed. You are logged out.')
            }
            console.log('connection update', update)
          }

			    if(events['creds.update']) {
				    await saveCreds()
			    }
      })
      return this.sock
    } catch (error) {
      return error
    }
  }
}



export default  WhatsappService;
