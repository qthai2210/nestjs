import { Schema, Document } from "mongoose";
import { Collection } from "mongoose";
import { User } from "src/user/models/user.model";
import { Category } from "./category.model";


const PostSchema = new Schema(
    {
        title: String,
        description: String,
        content: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        tags: [String],
        numbers: [Number],
        categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    },
    {
        timestamps: true,
        // timestamps: { createdAt
        //     : 'created_at', updatedAt: 'updated_at' }
        collection: 'posts'
    }

);

export { PostSchema };

export interface Post extends Document {
    title: string;
    description: string;
    content: string;
    user: User;
    tags: [string];
    numbers: [number];
    categories: [Category];
}