import { UserDtoType } from "../types/types.js";

class UserDto {
  email;
  id;
  isActivated;

  constructor(model: UserDtoType) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
  }
}

export { UserDto };
