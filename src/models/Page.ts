import mongoose, { Document, models, Schema } from "mongoose";

// Interface for the Page document
export interface IPage extends Document {
  uri: string;
  owner: string;
  displayName: string;
  location: string;
  bio: string;
  bgType: string;
  bgColor: string;
  bgImage: string;
  createdAt: Date;
  updatedAt: Date;
  buttons: { [key: string]: string };
  links:{ [key: string]: string };
}

const PageSchema = new Schema<IPage>(
  {
    uri: {
      type: String,
      required: [true, "Username is required"],
      minlength: [1, "Username min length is 1"],
      unique: true,
    },
    owner: {
      type: String,
      required: [true, "owner is required"],
    },
    displayName: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    bgType: {
      type: String,
      default: "color",
    },
    bgColor: {
      type: String,
      default: "#000",
    },
    bgImage: {
      type: String,
      default: "",
    },
    buttons: {
      type: Object,
      default: {},
    },
    links:{
      type:Object,
      default:{},
    }
  },
  { timestamps: true }
);

const Page =
  (models.Page as mongoose.Model<IPage>) ||
  mongoose.model<IPage>("Page", PageSchema);

export default Page;
