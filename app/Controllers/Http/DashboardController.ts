import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LokasiRambu from 'App/Models/LokasiRambu';
import Pengaduan from 'App/Models/Pengaduan';
import Env from "@ioc:Adonis/Core/Env"
import Drive from '@ioc:Adonis/Core/Drive'
import Po from 'App/Models/Po';
import Sekolah from 'App/Models/Sekolah';
import PerlintasanKeretaApi from 'App/Models/PerlintasanKeretaApi';

export default class DashboardController {
  async index({response}: HttpContextContract){
    const rambus = await LokasiRambu.query().preload("rambu").orderBy('id','asc')


    const datarambus: {}[]=[];

    //data rambu
    rambus.forEach(async element => {
      const row ={}
      row['id']= element.id
      row['position']= {lat: element.lat, lng: element.lng}
      row['tooltip']= "<h4>" + element.rambu.name + "</h4><div>"+ element.address +"</div><div>Kondisi : <b>"+ element.status.toUpperCase() +"</b></div>",
      row['icon']= Env.get("BASE_URL")+ await Drive.getSignedUrl("images/apps/"+ element.rambu.icon)
      row['draggable']= false
      row['visible']= true
      row['size']= [32,32]

      datarambus.push(row)
    });

    //data pos jaga
    const pospantau = await Po.query().orderBy("id",'asc')
    pospantau.forEach(async element => {
      const row ={}
      row['id']= element.id
      row['position']= {lat: element.lat, lng: element.lng}
      row['tooltip']= "<h4>" + element.name + "</h4><div>"+ element.address +"</div>"
      row['icon']= "/images/home.png"
      row['draggable']= false
      row['visible']= true
      row['size']= [32,32]

      datarambus.push(row)
    });

    //data sekolah
    const sekolah = await Sekolah.query().orderBy("id",'asc')
    sekolah.forEach(async element => {
      const row ={}
      row['id']= element.id
      row['position']= {lat: element.lat, lng: element.lng}
      row['tooltip']= "<h4>" + element.name + "</h4><div>"+ element.address +"</div>"
      row['icon']= "/images/school.png"
      row['draggable']= false
      row['visible']= true
      row['size']= [32,32]

      datarambus.push(row)
    });

     //data sekolah
     const perlintasans = await PerlintasanKeretaApi.query().orderBy("id",'asc')
     perlintasans.forEach(async element => {
       const row ={}
       row['id']= element.id
       row['position']= {lat: element.lat, lng: element.lng}
       row['tooltip']= "<h4>" + element.name + "</h4><div>"+ element.address +"</div>"
       row['icon']= "/images/train-station.png"
       row['draggable']= false
       row['visible']= true
       row['size']= [32,32]

       datarambus.push(row)
     });

    //data pengaduan
    const pengaduans = await Pengaduan.query().preload('user').preload('jenispengaduan').orderBy("id", 'asc')

    pengaduans.forEach(async element  => {
      const row ={}
      let status = element.status == '1' ? '<span style="color:red">Laporan Baru</span>' : element.status == '2' ? '<span style="color:orange">Dalam Penanganan</span>'  : '<span style="color:green">Selesai</span>'
      row['id']= element.id
      row['position']= {lat: element.lat, lng: element.lng}
      row['tooltip']= "<h4><center><img src='"+ Env.get("BASE_URL")+ await Drive.getSignedUrl("images/laporans/"+ element.fotoAwal ) +"' width='120px' height='100px' /></center> <br> <hr>" + element.jenispengaduan.name + "</h4><div>"+ element.content +"</div><div>Kondisi : <b>"+ status +"</b></div><div>Dari : <b>"+element.user.name+"</b></div>",
      row['icon']= element.jenispengaduan.kode=='KLL' ? element.status== '1' ? "/images/riple-3.gif" : "/images/icon-skeleton-merah.png" :element.status== '1' ? "/images/riple-3.gif" : "/images/icon-marker-merah.png"
      row['draggable']= false
      row['visible']= true
      row['size']= element.status == '1' ? [52,52]: [32,32]

      datarambus.push(row)
    });

    //rekap
    const jmlpengaduan = await Pengaduan.query().getCount();

    const jmlpos = await Po.query().getCount()

    const jmlperlintasan = await PerlintasanKeretaApi.query().getCount()

    const jmlsekolah = await Sekolah.query().getCount()

    return response.json({
      rambus:datarambus,
      data:{
        jmlpengaduan: jmlpengaduan,
        jmlpos:jmlpos,
        jmlperlintasan:jmlperlintasan,
        jmlsekolah:jmlsekolah,
      }
    })
  }
}
