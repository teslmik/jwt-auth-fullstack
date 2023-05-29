import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import { v4 } from 'uuid';

import { UserDto } from '../dto/user.dto.js';
import { ApiError } from '../exeptions/api-error.js';
import UserModel from '../models/user.model.js';
import { UserDtoType } from '../types/types.js';
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

  async login(email: string, password: string) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(`Invalid email or password`);
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest(`Invalid email or password`);
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken: string) {
    const token = await tokenService.removeToken(refreshToken);

    return token;
  }

  async activate(activationLink: string) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest('Incorrect activation link!');
    }

    user.isActivated = true;
    await user.save();
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken) as JwtPayload | null;
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await UserModel.findById(userData.id) as UserDtoType;
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }
}

export const userService = new UserService();
