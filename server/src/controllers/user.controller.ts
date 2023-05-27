import { NextFunction, Request, Response } from 'express';

import { userService } from '../services/user.service.js';

import { type UserReqDto } from '../types/types.js';

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password }: UserReqDto = req.body;
      const userData = await userService.registration(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      });

      return res.json(userData);
    } catch (error) {
      console.log(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {}
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {}
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {}
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {}
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(['123', '456']);
    } catch (error) {}
  }
}

export const userController = new UserController();
