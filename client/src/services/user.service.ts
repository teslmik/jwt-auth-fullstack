import { AxiosResponse } from 'axios';

import $api from "../http";
import { UserType } from "../types/types";

class UserService {
  static fetchUsers(): Promise<AxiosResponse<UserType[]>> {
    return $api.get<UserType[]>('/users');
  }
}

export { UserService };