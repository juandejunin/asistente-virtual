// src/services/UserService.ts
import { UserModel, IUser } from "../models/User";

class UserService {
  static async createUser(data: {
    username: string;
    password: string;
    role: "admin" | "super_admin";
  }): Promise<IUser> {
    return await UserModel.create(data);
  }

  static async getUserByUsername(username: string): Promise<IUser | null> {
    return await UserModel.findOne({ username });
  }
}

export default UserService;
