import { AxiosResponse } from 'axios';

import api from '../http';
import { AuthRequest, AuthResponce } from '../types/types';

class AuthService {
  static async login({ email, password }: AuthRequest): Promise<AxiosResponse<AuthResponce>> {
    return api.post<AuthResponce>('/login', { email, password });
  }

  static async registration({ email, password }: AuthRequest): Promise<AxiosResponse<AuthResponce>> {
    return api.post<AuthResponce>('/registration', { email, password });
  }

  static async logout(): Promise<void> {
    return api.post('/logout');
  }
}

export { AuthService };
