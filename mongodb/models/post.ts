import { Comment, IComment, ICommentBase } from "@/types/comment";
import { IUser } from "@/types/users";
import mongoose, {Schema, Document, models, Model} from "mongoose";

export interface IPostBase {
    user: IUser;
    text: string;
    imageUrl?: string;
    comments?: IComment[];
    likes?: string[];
}


export interface IPost extends IPostBase, Document {
    createdAt: Date;
    updatedAt: Date;
}


// Methods for each instance of a post
interface IPostMethods {
    likePost(userId: string): Promise<void>;
    unlikePost(userId: string): Promise<void>;
    commentOnPost(comment: ICommentBase): Promise<void>;
    getAllComments(): Promise<IComment[]>;
    removePost(): Promise<void>;
}

interface IPostStatics {
    getAllPosts(): Promise<IPostDocument[]>;
}


// for singular instances of a post
export interface IPostDocument extends IPost, IPostMethods {}

// for all posts
interface IPostModel extends IPostStatics, Model<IPostDocument> {}


const PostSchema = new Schema<IPostDocument>({
    user: {
        userId: {type: String, required: true},
        userImage: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String},
    },
    text: {type: String, required: true},
    imageUrl: {type: String},
    comments: {type: [Schema.Types.ObjectId], ref: "Comment", default: []},
    likes: {type: [String]},
}, {
    timestamps: true,
});

PostSchema.methods.likePost = async function (userId:string) {
    try {
        await this.updateOne({$addToSet: {likes: userId}});
    } catch (error) {
        console.log("Failed to like post", error);
    }    
};

PostSchema.methods.unlikePost = async function (userId:string) {
    try {
        await this.updateOne({$pull: {likes:userId}});
    } catch (error) {
        console.log("Failed to unlike the post", error);
    }
};

PostSchema.methods.removePost = async function (userId:string) {
    try {
        await this.model("Post").deleteOne({_id:this._id});
    } catch (error) {
        console.log("Failed to remove the post", error);
    }

}

PostSchema.methods.commentOnPost = async function (commentToAdd:ICommentBase) {
    try {
        const comment = await Comment.create(commentToAdd);
        this.comment.push(comment._id);
        await this.save();
    } catch(error) {
        console.log("Failed to Comment on the Post", error)
    }
};

PostSchema.methods.getAllPosts = async function () {
    try {
        const posts = await this.find()
        .sort({ createdAt: -1 })
        .populate({
            path: "comments",
            options: { sort: { createdAt: -1 }}
        }).lean()   // lean() converts mongoose object to a js object


        return posts.map((post: IPostDocument) => ({
            ...post,
            // _id: post._id.toString(),
            _id: post._id,
            comments: post.comments?.map((comment: IComment) => ({
                ...comment,
                // _id: comment._id.toString(),
                _id: comment._id,
            })),
        }));

    } catch(error) {
        console.log("Error loading all the Posts", error);
    }
};

PostSchema.methods.getAllComments = async function () {
    try {
        await this.populate({
            path: "comments",
            options: { sort: {createdAt: -1}},  // sorts comments by newest first
        });
        return this.comments;

    } catch(error) {
        console.log("Error loading all the comments", error);
    }
};


export const Post = (models.post as IPostModel) || mongoose.model<IPostDocument, IPostModel>("Post", PostSchema);
