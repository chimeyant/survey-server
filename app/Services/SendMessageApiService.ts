import makeWASocket, { AnyMediaMessageContent, DisconnectReason, SignalDataSet, SignalDataTypeMap, delay, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, makeInMemoryStore, useMultiFileAuthState } from "@whiskeysockets/baileys";
import OutboxService from "./Pesan/OutboxService";
import Env from "@ioc:Adonis/Core/Env"

export type dataType={
  senderNumber: number,
}

export type dataMessageType={
  uuid:string,
  recieveNumber:string,
  message:string,
}

class SendMessageApiService {
  private data;
  public sock;
  protected outboxSvc;
  public booted = false

  constructor(data:dataType){
    this.data= data
    this.outboxSvc = new OutboxService
  }

  public async openConnection(){
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

              if(connection==='close'){
                return false
              }

              else if(connection === "open"){
                return true;
              }
            }

            //save cre
            if(events['creds.update']) {
              await saveCreds()
            }
        })

    } catch (error) {
      return this.sock =null;
    }
  }

  public async sendText(data: dataMessageType){
    await this.sock.presenceSubscribe(data.recieveNumber);
    await delay(500);

    await this.sock.sendPresenceUpdate("composing", data.recieveNumber);
    await delay(2000);

    await this.sock.sendPresenceUpdate("paused",data.recieveNumber);

    await this.sock.sendMessage(data.recieveNumber,{text:data.message})

    console.log("Message sended to "+ data.recieveNumber)

    this.outboxSvc.updateStatus(true, 'sended', data.uuid)
  }

  public async sendImage(){

  }
}

export default SendMessageApiService
