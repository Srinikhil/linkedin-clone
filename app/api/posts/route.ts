import connectDB from "@/mongodb/db";
import { IPostBase, Post } from "@/mongodb/models/post";
import { IUser } from "@/types/users";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export interface AddPostRequestBody {
    user: IUser;
    text: string;
    imageUrl?: string | null;
}

export async function POST(request: Request) {
    auth().protect();   // this is of clerk authentication which checks this route to access only by authenticated users.
    
    try {
    await connectDB();
    const { user, text, imageUrl }: AddPostRequestBody = await request.json();

    const postData: IPostBase = {
        user,
        text,
        ...(imageUrl && { imageUrl}),
    };

    const post = await Post.create(postData);
    return NextResponse.json({message: "Post created successfully", post});

    } catch(error) {
        return NextResponse.json (
            {error: "Error occured while creating the post"},
            {status: 500}
        );
    }
}

export async function GET() {
    try {

        console.log('Imported Post:', Post);

        await connectDB();

        const posts = await Post.getAllPosts();
        console.log(posts);
        
        return NextResponse.json({ posts });
    } catch (error) {
        return NextResponse.json (
            {error: `Error occured while fetching the post ${error}`},
            {status: 500}
        );
    }
}