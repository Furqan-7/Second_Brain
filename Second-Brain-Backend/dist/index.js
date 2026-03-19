import express from "express";
import { string, success, z } from "zod";
import jwt, {} from "jsonwebtoken";
import { ContentModel, LinkModel, Tag, UserModel } from "./db.js";
import bcrypt from "bcrypt";
import mongoose, { mongo } from "mongoose";
import { MiddleWhere } from "./MiddleWhere.js";
import { ENV } from "./config/env.js";
import { random } from "./RandomHash.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
const ValidSchema = z.object({
    username: z.string().min(3).max(20),
    password: z
        .string()
        .min(5)
        .max(20)
        .regex(/[A-Z]/, "Must contain one uppercase letter")
        .regex(/[a-z]/, "Must contain one lowercase letter"),
});
const contentSchema = z.object({
    link: z.string(),
    type: z.string(),
    title: z.string(),
    tags: z.array(z.string()).optional(),
    userId: z.string(),
});
export var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus[ResponseStatus["Continue"] = 100] = "Continue";
    ResponseStatus[ResponseStatus["Success"] = 200] = "Success";
    ResponseStatus[ResponseStatus["NotFound"] = 404] = "NotFound";
    ResponseStatus[ResponseStatus["BadRequest"] = 400] = "BadRequest";
    ResponseStatus[ResponseStatus["Error"] = 500] = "Error";
})(ResponseStatus || (ResponseStatus = {}));
app.post("/api/v1/signup", async (req, res) => {
    console.log("Reached Sign Up");
    const Response = ValidSchema.safeParse(req.body);
    if (!Response.success) {
        return res.status(ResponseStatus.BadRequest).json({
            message: "Please Enter Correct Username and Password and ",
            Response: Response.error,
        });
    }
    const { username, password } = Response.data;
    try {
        //    Hash the Password First
        const HashPassword = await bcrypt.hash(password, 10);
        await UserModel.create({
            username: username,
            password: HashPassword,
        });
        return res.status(ResponseStatus.Success).json({
            message: "Signup Success",
            valid: true,
        });
    }
    catch (e) {
        return res.status(ResponseStatus.BadRequest).json({
            message: "Signup failed",
            valid: false,
        });
    }
});
app.post("/api/v1/signin", async (req, res) => {
    const Response = ValidSchema.safeParse(req.body);
    if (!Response.success) {
        return res.status(ResponseStatus.BadRequest).json({
            message: "Please Enter Correct Username and Password",
        });
    }
    const { username, password } = Response.data;
    const User = await UserModel.findOne({
        username: username,
    });
    if (!User) {
        return res.status(ResponseStatus.NotFound).json({
            message: "User Not Found!",
        });
    }
    const isValid = await bcrypt.compare(password, User.password);
    if (!isValid) {
        return res.status(ResponseStatus.NotFound).json({
            message: "User Not Found!",
        });
    }
    else {
        const token = jwt.sign({ userId: User._id.toString() }, ENV.JWT_TOKEN, {
            expiresIn: "24h",
        });
        return res.status(ResponseStatus.Success).json({
            token: token,
            message: "Sign up Sucessfully ",
            valid: true,
        });
    }
});
app.post("/api/v1/content", MiddleWhere, async (req, res) => {
    const Response = await contentSchema.safeParse({
        link: req.body.link,
        type: req.body.type,
        title: req.body.title,
        tags: req.body.tags,
        userId: res.locals.userId
    });
    if (!Response.success) {
        return res.status(ResponseStatus.BadRequest).json({
            message: "Incorrect Format",
            error: Response.error,
        });
    }
    try {
        const data = Response.data;
        if (!mongoose.isValidObjectId(data?.userId)) {
            return res.status(ResponseStatus.NotFound).json({
                message: "Invalid user",
            });
        }
        const user = await UserModel.exists({
            _id: data.userId,
        });
        if (!user) {
            return res.status(ResponseStatus.NotFound).json({
                message: "User Not Found !",
            });
        }
        const content = await ContentModel.create({
            link: data.link,
            type: data.type,
            title: data.title,
            tags: data.tags ?? [],
            userId: data.userId,
        });
        return res.status(ResponseStatus.Success).json({
            content: content,
            message: "Content Created Successfully",
        });
    }
    catch (e) {
        res.status(ResponseStatus.BadRequest).json({
            message: "Process Failed ! ",
            Error: e,
        });
    }
});
app.post("/tag", async (req, res) => {
    const title = req.body.title;
    try {
        // Check if tha tags already eixts
        let tag = await Tag.findOne({ title });
        if (!tag) {
            tag = await Tag.create({ title });
        }
        res.status(ResponseStatus.Success).json({ tag });
    }
    catch (e) {
        return res.status(ResponseStatus.BadRequest).json({
            message: "Failed to Create a Tag",
            error: e,
        });
    }
});
app.get("/api/v1/content", MiddleWhere, async (req, res) => {
    const userId = res.locals.userId;
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(ResponseStatus.NotFound).json({
            message: "Invalid userId",
        });
    }
    try {
        const content = await ContentModel.find({ userId })
            .populate("tags");
        if (!content) {
            return res.status(ResponseStatus.NotFound).json({
                message: "Not Found",
            });
        }
        else {
            return res.status(ResponseStatus.Success).json({
                message: "Feached Content Sucessfully",
                content: content,
            });
        }
    }
    catch (e) {
        return res.status(ResponseStatus.Error).json({
            message: "Internal Server Error. Please try again later",
            Error: e,
        });
    }
});
app.delete("/api/v1/content", MiddleWhere, async (req, res) => {
    const userId = res.locals.userId;
    const ContentId = req.body.ContentId;
    if (!mongoose.isValidObjectId(ContentId)) {
        return res.status(ResponseStatus.BadRequest).json({
            message: "Invalid Content id ",
        });
    }
    try {
        const Done = await ContentModel.findByIdAndDelete({
            _id: ContentId,
            userId: userId,
        });
        if (!Done) {
            return res.status(ResponseStatus.BadRequest).json({
                message: "Failed to Delete a content ",
            });
        }
        else {
            return res.status(ResponseStatus.Success).json({
                message: "Content Deleted Successfuly",
            });
        }
    }
    catch (e) {
        return res.status(ResponseStatus.Error).json({
            message: "Internal Server Error. Please try again later",
            Error: e,
        });
    }
});
app.post("/api/v1/brain/share", MiddleWhere, async (req, res) => {
    const Share = req.body.Share;
    const userId = res.locals.userId;
    if (Share) {
        const Link = await LinkModel.create({
            hash: random(10),
            userId: userId,
        });
        return res.status(ResponseStatus.Success).json({
            hash: Link,
            message: "Created Link ",
        });
    }
    else {
        await LinkModel.deleteOne({
            userId: userId,
        });
        return res.status(ResponseStatus.Success).json({
            message: "Deleted Sharable Link ",
        });
    }
});
app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    console.log("Reached Share ");
    const link = await LinkModel.findOne({ hash });
    if (!link) {
        return res.status(ResponseStatus.NotFound).json({
            message: "Invalid Link",
        });
    }
    try {
        const user = await UserModel.findOne({ _id: link.userId }); // findOne, not find
        if (!user) {
            return res.status(ResponseStatus.NotFound).json({
                message: "User not found",
            });
        }
        const content = await ContentModel.find({ userId: link.userId }).populate("tags");
        res.status(ResponseStatus.Success).json({
            user,
            content,
            message: "Fetched Content Successfully",
        });
    }
    catch (e) {
        return res.status(ResponseStatus.Error).json({
            message: "Internal Server Error. Please try again later",
            error: e,
        });
    }
});
// api for fetching all the content that has type twitter 
app.get("/api/v1/content/twitter", MiddleWhere, async (req, res) => {
    const userId = res.locals.userId;
    console.log("Reached Twitter");
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(ResponseStatus.NotFound).json({
            message: "Invalid userId",
        });
    }
    try {
        const content = await ContentModel.find({ userId, type: 'twitter' })
            .populate("tags");
        if (!content) {
            return res.status(ResponseStatus.NotFound).json({
                message: "Not Found",
            });
        }
        else {
            return res.status(ResponseStatus.Success).json({
                message: "Feached Content Sucessfully",
                content: content,
            });
        }
    }
    catch (e) {
        return res.status(ResponseStatus.Error).json({
            message: "Internal Server Error. Please try again later",
            Error: e,
        });
    }
});
app.listen(3000, () => {
    console.log("The Server is Running on 3000 port");
});
//# sourceMappingURL=index.js.map