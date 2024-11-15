import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image: string;
  emailVerified: Date;
}
const UserSchema = new Schema<IUser>({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  image: {
    type: String,
  },
  emailVerified: {
    type: Date,
  },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User