import type { JobHandlerContract, Job } from '@ioc:Setten/Queue'
import Utility from 'App/Helpers/Utility'
import OutboxService from 'App/Services/Pesan/OutboxService'
import SendMessageApiService from 'App/Services/SendMessageApiService'

export type SendMessagePayload = {
  senderNumber:number,
  userName:string
}

export default class implements JobHandlerContract {
  protected  OutboxSvc;
  private booted = false;

	constructor(public job: Job) {
    this.job = job
    this.OutboxSvc = new OutboxService;
  }

  /**
   * Base Entry point
   */
  public async handle(payload: SendMessagePayload) {
    const whatsappSvc = new SendMessageApiService({ senderNumber: payload.senderNumber })

    console.log("Status :"+ this.booted)

    try {
      //open whatsapp conncektion
      if(!this.booted){
        await whatsappSvc.openConnection()
      }


      whatsappSvc.sock.ev.process(async (events)=>{
        if(events['connection.update']){
          const update = events['connection.update'];
          const {connection, lastDisconnect,}= update

          if(connection==='close'){
            console.log('Koneksi Ulang')
            this.booted= false
          }
          else if(connection === "open"){
            this.booted =true
            const result = await this.OutboxSvc.firstBySenderNumber(payload.senderNumber)

            if(result){
                const data ={
                  uuid: result?.uuid,
                  userName: payload.userName,
                  senderNumber: result?.senderNumber,
                  recieveNumber: await Utility.phoneNumberFormatter(result?.recieveNumber),
                  type: result.type,
                  message:result.content,
                  api:true,
                }

                console.log("Sending Data...!")
                await whatsappSvc.sendText(data)
            }else{
                console.log("No Data To Send...! "+ payload.senderNumber)
            }
          }
        }
      })
    } catch (error) {
      whatsappSvc.openConnection()
      console.log("Opps..., terjadi kesalahan"+ error)

    }
  }

  /**
   * This is an optional method that gets called if it exists when the retries has exceeded and is marked failed.
   */
  public async failed() {}
}
