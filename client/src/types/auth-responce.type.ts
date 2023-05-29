import { type UserType } from "./user.type";

type AuthResponce = {
  accessToken: string;
  refreshToken: string;
  user: UserType;
}

export { type AuthResponce };
