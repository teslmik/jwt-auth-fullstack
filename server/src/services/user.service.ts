import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

import { UserDto } from '../dto/user.dto.js';
import { ApiError } from '../exeptions/api-error.js';
import UserModel from '../models/user.model.js';
import { mailService } from './mail.service.js';
import { tokenService } from './token.service.js';

class UserService {
  async registration(email: string, password: string) {
    const checkEmail = await UserModel.findOne({ email });

    if (checkEmail) {
      throw ApiError.BadRequest(`User with email address ${email} already exists`);
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = v4();
    const user = await UserModel.create({ email, password: hashPassword, activationLink });
    await mailService.sendActivationMail({ to: email, link: `${process.env.API_URL}/api/activate/${activationLink}` });

    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink: string) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest('Incorrect activation link!');
    }

    user.isActivated = true;
    await user.save();
  }
}

export const userService = new UserService();
