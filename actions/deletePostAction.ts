'use server'

import { Post } from "@/mongodb/models/post";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function deletePostAction(postId:string) {
    const user = await currentUser();

    if (!user?.id) {
        throw new Error("User not authenticated");
    }

    const post = await Post.findById(postId);

    if (!post) {
        throw new Error("Post not Found !");
    }

    if (post.user.userId !== user.id) {
        throw new Error("Post doesn't belong to the user, hence cannot delete it.");
    }

    try {
        await post.removePost();
        revalidatePath("/");
    } catch (error) {
        throw new Error("Error occured while deleting the post");
    }

}