import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AppInfo from 'App/Models/AppInfo'
import Env from "@ioc:Adonis/Core/Env"
import Drive from "@ioc:Adonis/Core/Drive"


export default class AppsController {
  async index({}:HttpContextContract){
    const appinfo = await AppInfo.query().first()

    const logourl = await Drive.getSignedUrl("images/apps/"+ appinfo?.app_logo)

   const data = {
    app_name: appinfo?.app_name,
    app_ver: appinfo?.app_ver,
    app_desc: appinfo?.app_desc,
    app_logo: appinfo?.app_logo == 'logo.png'? Env.get("BASE_URL")+  "/images/apps/"+ appinfo?.app_logo :Env.get("BASE_URL")+ logourl  ,
    app_theme: {
      mode:appinfo?.app_theme,
      color:appinfo?.app_color
    },
    app_background: Env.get("BASE_URL")+ "/images/apps/"+   appinfo?.app_background,
    app_nav : Env.get("BASE_URL")+ "/images/apps/"+   appinfo?.app_nav,
    app_url: appinfo?.app_url,
    app_company: appinfo?.app_company,
    app_slogan: appinfo?.app_slogan,
    app_address: appinfo?.app_address,
    app_wa: appinfo?.app_wa
   }

   return data;
  }

  async menus({auth}: HttpContextContract){
    const user = await auth.user

    const authent = await user?.authent

    let menus :{} = [];

    if(authent == 'superadmin'){
      menus = [
        {
          title: "Dashboard",
          type: "item",
          icon: "mdi-view-dashboard",
          route: "/backend/dashboard",
        },

        { title: "APLIKASI", type: "divisi", route: "/" , icon:'mdi-desktop-mac-dashboard'},
        { title: "Data Master", type: "subMenu", route: "/", submenus:[
          {
            title: "Informasi Aplikasi",
            icon: "mdi-desktop-mac-dashboard",
            route: "/backend/master-app-info",
            type: "item",
          },
          {
            title: "Master Sekolah",
            icon: "mdi-office-building-outline",
            route: "/backend/master-sekolah",
            type: "item",
          },
          {
            title: "Master Jenis",
            icon: "mdi-widgets",
            route: "/backend/master-jenis",
            type: "item",
          },
        ] },


        { title: "Aktifitas", type: "subMenu", route: "/", submenus:[
          {
            title: "Data Umpan Balik",
            icon: "mdi-bullhorn",
            route: "/backend/aktifitas",
            type: "item",
          },
        ] },



        { title: "Utility", type: "subMenu", route: "/", submenus:[
          {
            title: "Akun Aplikasi",
            icon: "engineering",
            route: "/backend/user",
            type: "item",
          },
          {
            title: "Profil Pengguna",
            icon: "accessibility",
            route: "/backend/profil-akun",
            type: "item",
          },
          {
            title: "Ganti Kata Sandi",
            icon: "vpn_key",
            route: "/backend/chngpwd",
            type: "item",
          },
        ] },
      ];
      return menus;
    }

    if(authent == 'administrator'){
      menus = [

      ];
      return menus;
    }





    /**
     * Menu User
     */
     if(authent == 'customer'){
      menus = [
        {
          title: "Dashboard",
          type: "item",
          icon: "mdi-view-dashboard",
          route: "/backend/dashboard",
        },
        { title: "Data Master", type: "subMenu", route: "/", submenus:[
          {
            title: "Pengaturan",
            icon: "mdi-cog-outline",
            route: "/backend/master-pengaturan",
            type: "item",
          },
          {
            title: "Kontak",
            icon: "mdi-contacts",
            route: "/backend/master-contact",
            type: "item",
          },
        ] },

        { title: "PESAN", type: "divisi", route: "/" , icon:'mdi-folder'},
        {
          title: "Pesan Keluar",
          icon: "mdi-message-plus-outline",
          route: "/backend/pesan-keluar",
          type: "item",
        },
        {
          title: "Pesan Masuk",
          icon: "mdi-message-text",
          route: "/backend/keselamatan-renaksi",
          type: "item",
        },



        { title: "Utility", type: "subheader", route: "/" },
        {
          title: "Profil Pengguna",
          icon: "accessibility",
          route: "/backend/profil-akun",
          type: "item",
        },
        {
          title: "Ganti Kata Sandi",
          icon: "vpn_key",
          route: "/backend/chngpwd",
          type: "item",
        },


      ];
      return menus;
    }

  }
}
