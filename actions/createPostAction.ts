'use server'

import { AddPostRequestBody } from "@/app/api/posts/route";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/users";
import { currentUser } from "@clerk/nextjs/server"

export default async function createPostAction(formData:FormData) {
    const user = await currentUser()
try {
    if (!user) {
        throw new Error("User not authenticated");
    }

    const postInput = formData.get("postInput") as string;
    const image = formData.get("image") as File;
    let imageUrl: string | undefined;

    if(!postInput) {
        throw new Error("Post inout is required")
    }

    // Define user
    const userDB: IUser = {
        userId: user.id,
        userImage: user.imageUrl,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
    };

    if(image.size > 0) {
        // 1. Upload image if there is one
        // 2. Create post in database with image
        const body: AddPostRequestBody = {
            user:userDB,
            text:postInput,
            imageUrl: imageUrl,
        };
        await Post.create(body);

    } else {
        // 1. Create post in database without image
        const body: AddPostRequestBody = {
            user:userDB,
            text:postInput,
        };
        await Post.create(body);
    }
} catch (error: any) {
    throw new Error("Failed to create the post", error);
}


    


    // Revalidate the path for home page

}