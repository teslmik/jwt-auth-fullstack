import jwt, { type JwtPayload } from 'jsonwebtoken';

import tokenModel from '../models/token.model.js';

import { type Types } from 'mongoose';

class TokenService {
  generateToken(payload: JwtPayload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY as string, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY as string, { expiresIn: '30d' });

    return { accessToken, refreshToken };
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
}

export const tokenService = new TokenService();