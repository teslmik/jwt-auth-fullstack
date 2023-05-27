import { Document, Types } from "mongoose";

import { type UserSchemaType } from "./types.js";

type UserDtoType = Document<unknown, UserSchemaType> & Omit<UserSchemaType & {
  _id: Types.ObjectId;
}, never>

export { UserDtoType };
