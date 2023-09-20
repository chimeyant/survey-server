import User from "App/Models/User";

class UserService {
  constructor() {

  }

  public async getByUuid(id:string){
    try {
      const model = await User.findBy("id", id)

      return model;
    } catch (error) {

    }
  }
}

export default UserService
