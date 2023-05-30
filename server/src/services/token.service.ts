import jwt, { type JwtPayload } from 'jsonwebtoken';

import tokenModel from '../models/token.model.js';

import { type Types } from 'mongoose';

class TokenService {
  generateToken(payload: JwtPayload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY as string, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY as string, { expiresIn: '30d' });

    return { accessToken, refreshToken };
  }

  validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_KEY as string);

      return userData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_KEY as string);

      return userData;
    } catch (error) {
      return null;
    }
  }

  async saveToken(userId: Types.ObjectId, refreshToken: string) {
    const tokenData = await tokenModel.findOne({ user: userId });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;

      return tokenData.save();
    }

    const token = await tokenModel.create({ user: userId, refreshToken });

    return token;
  }

  async removeToken(refreshToken: string) {
    const tokenData = await tokenModel.deleteOne({ refreshToken });

    return tokenData;
  }

  async findToken(refreshToken: string) {
    const tokenData = await tokenModel.findOne({ refreshToken });

    return tokenData;
  }
}

export const tokenService = new TokenService();