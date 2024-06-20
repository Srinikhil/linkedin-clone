import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params } : {params: {post_id: string } }
) {
    await connectDB();

    try {
        const post = await Post.findById(params.post_id);

        if (!post) {
            return NextResponse.json({error: "Post not found"}, {status: 400});
        }

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json (
            {error: "Error occured while creating the post"},
            {status: 500}
        );
    }
}

export interface DeletePostRequestBody {
    userId: string;
}


export async function DELETE(
    request:Request,
    { params }: {params: {post_id: string}}
    ) {
        auth().protect();

        await connectDB();

        const {userId}: DeletePostRequestBody = await request.json();

        try {
            const post = await Post.findById(params.post_id);

            if (!post) {
                return NextResponse.json({error: "Post not found"}, {status: 400});
            }

            if (post.user.userId !== userId) {
                throw new Error("Post belongs to another user")
            }

            await post.removePost();

        } catch (error) {
            return NextResponse.json (
                {error: "Error occured while creating the post"},
                {status: 500}
            );
        }

    
}