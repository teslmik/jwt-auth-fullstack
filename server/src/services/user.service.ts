import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

import UserModel from '../models/user.model.js';
import { mailService } from './mail.service.js';

class UserService {
  async registration(email: string, password: string) {
    const checkEmail = await UserModel.findOne({ email });

    if (checkEmail) {
      throw new Error(`User with email address ${email} already exists`);
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = v4();
    const user = await UserModel.create({ email, password: hashPassword, activationLink });
    await mailService.sendActivationMail(email, activationLink);
  }
}

export const userService = new UserService();
