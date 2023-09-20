import makeWASocket, { AnyMediaMessageContent, DisconnectReason, SignalDataSet, SignalDataTypeMap, delay, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, makeInMemoryStore, useMultiFileAuthState } from "@whiskeysockets/baileys";
import Ws from "./Ws";
import OutboxService from "./Pesan/OutboxService";
import Env from "@ioc:Adonis/Core/Env"

export type dataType={
  uuid:string,
  userName:string
  senderNumber: number,
  recieveNumber: number,
  type: string,
  message: string
  api:boolean,
}

class SendMessageService {
  private data;
  private sock;
  protected outboxSvc;
  public booted = false

  constructor(data:dataType){
    this.data= data
    this.outboxSvc = new OutboxService
  }

  public async open(){
    try {
      const auth_folder = Env.get("NODE_ENV") == "production" ? "../wa_auth/" : "./wa_auth/"
      const {state, saveCreds}= await useMultiFileAuthState(auth_folder+ this.data.senderNumber )
      const {version, isLatest} = await fetchLatestBaileysVersion()
        this.sock = makeWASocket({
          version,
          auth:{
            creds: state.creds,
            keys: state.keys
          },
          printQRInTerminal:false,
          syncFullHistory:false,
        })

        this.sock.ev.process(
          async (events)=>{
            if(events['connection.update']){
              const update = events['connection.update'];
              const {connection, lastDisconnect,}= update
              console.log(connection)

              if(connection==='close'){
                console.log('reconect if not logoute')

              }

              else if(connection === "open"){
                console.log("connected")
                if(this.data.type=='text'){
                  this.sendText()
                  return true
                }
              }
            }
            // credentials updated -- save them
            if(events['creds.update']) {
              await saveCreds()
            }
        })

        return true

    } catch (error) {
      return false;
    }

  }

  public async sendText(){
    await this.sock.presenceSubscribe(this.data.recieveNumber);
    await delay(500);

    await this.sock.sendPresenceUpdate("composing", this.data.recieveNumber);
    await delay(2000);

    await this.sock.sendPresenceUpdate("paused", this.data.recieveNumber);

    await this.sock.sendMessage(this.data.recieveNumber,{text:this.data.message})

    console.log("Message sended to "+ this.data.recieveNumber)

    await delay(1000)

    this.outboxSvc.updateStatus(true, 'sended', this.data.uuid)

    if(!this.data.api){
      Ws.io.emit( this.data.userName + ":sended",{
        message:"Pesan berhasil terkirim...!"
      })
    }
  }

  public async sendImage(){

  }
}

export default SendMessageService
