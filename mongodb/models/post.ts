import { Comment, IComment, ICommentBase } from "@/types/comment";
import { IUser } from "@/types/users";
import mongoose, {Schema, Document, Model, models} from "mongoose";

export interface IPostBase {
    user: IUser;
    text: string;
    imageUrl?: string;
    comments?: IComment[];
    likes?: string[];
}


export interface IPost extends IPostBase, Document {
    _id: string;
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

PostSchema.statics.getAllPosts = async function () {
    try {
        const posts = await this.find()
        .sort({ createdAt: -1 })
        .populate({
            path: "comments",
            options: { sort: { createdAt: -1 }},
        })
        // .populate("likes")
        .lean();   // lean() converts mongoose object to a js object

        
        return posts.map((post: IPostDocument) => ({
            ...post,
            // _id: post._id.toString(),
            _id: post._id && typeof post._id.toString === 'function' ? post._id.toString() : String(post._id),
            // _id: post._id,
            comments: post.comments?.map((comment: IComment) => ({
                ...comment,
                // _id: comment._id.toString(),
                _id: comment._id && typeof comment._id.toString === 'function' ? comment._id.toString() : String(comment._id),
                // _id: comment._id,

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


// If error occurs saying mongoose cannot create post once created, uncomment the below lines and run it again.

// if (mongoose.models.Post) {
//     delete mongoose.models.Post;
// }


console.log('models.Post:', models.Post);

const Post = models.Post as IPostModel || mongoose.model<IPostDocument, IPostModel>("Post", PostSchema);

// const Post = mongoose.model<IPostDocument, IPostModel>("Post", PostSchema);

// console.log('models.Post:', models.Post);
// console.log('Post:', Post);
// console.log('Post.getAllPosts:', Post.getAllPosts);

export { Post };

// export const Post = (models.Post as IPostModel) || mongoose.model<IPostDocument, IPostModel>("Post", PostSchema);
