import mongoose, { Types } from "mongoose";
import { Schema, model } from "mongoose";
import { hash } from "zod";
import { required } from "zod/mini";
import { ENV } from "./config/env.js";
mongoose.connect(ENV.DATABASE_URL)
    .then(() => console.log("✅ Connected to MongoDB locally"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const tagSchema = new Schema({
    title: { type: String, required: true, unique: true },
});
const ContetnTypes = ["image", "video", "artival", "audio"];
const contentSchema = new Schema({
    link: { type: String, required: true },
    type: { type: String, enum: ContetnTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type: Types.ObjectId, ref: "Tag" }],
    userId: { type: Types.ObjectId, ref: "User" },
    // validate: async function (value : Object) {
    //      const user = await UserModel.exists(value);
    //      if(!user){
    //       throw new Error("User Does not exits ");
    //      }
    // }
});
const linkSchema = new Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});
export const UserModel = model("User", UserSchema);
export const Tag = model("Tag", tagSchema);
export const ContentModel = model("Content", contentSchema);
export const LinkModel = model("Link", linkSchema);
//# sourceMappingURL=db.js.map