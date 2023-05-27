import { Schema, model } from 'mongoose';

import { UserSchemaType } from '../types/types.js';

const UserSchema = new Schema<UserSchemaType>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
});

export default model('User', UserSchema);
