'use client';

import { IPostDocument } from "@/mongodb/models/post"
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import ReactTimeago from "react-timeago";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import deletePostAction from "@/actions/deletePostAction";
import Image from "next/image";
import PostOptions from "./PostOptions";
import { toast } from "sonner";

function Post({post}: { post: IPostDocument }) {
    const { user } = useUser();

    const isAuthor = user?.id === post.user.userId;

  return (
    <div className="bg-white rounded-md border">
        <div className="p-4 flex space-x-2">
            <div>
                <Avatar>
                    <AvatarImage src={post.user.userImage} />
                    <AvatarFallback>
                        {post.user.firstName?.charAt(0)}
                        {post.user.lastName?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
            </div>

            <div className="flex justify-between flex-1">
                <div>
                    <p className="font-semibold">
                        {post.user.firstName} {post.user.lastName}{" "}
                        {isAuthor && (
                            <Badge className="ml-2" variant="secondary">
                                Author
                            </Badge>
                        )}
                    </p>
                    <p className="text-xs text-gray-400">
                        @{post.user.firstName}
                        {post.user.firstName}-{post.user.userId.toString().slice(-4)}
                    </p>
                    <p className="text-xs text-gray-400">
                        <ReactTimeago date={new Date(post.createdAt)}/>
                    </p>

                </div>

                {isAuthor && (
                    <Button variant="outline"
                        onClick={() => {
                            const promise = deletePostAction(post._id);
                            toast.promise(promise, {
                                loading: "Deleting the post ...",
                                success: "Post Deleted Successfully !!",
                                error: "Failed to delete the post",   
                            });
                        }}
                    >
                        <Trash2 />
                    </Button>
                )}

            </div>
        </div>
        <div>
            <p className="px-4 pb-2 mt-2"> {post.text} </p>
            {/* If there is an image then it displays here */}
            {post.imageUrl && (
                <Image
                    src={post.imageUrl}
                    alt="Post Image"
                    width={500}
                    height={500}
                    className="w-full mx-auto"
                />
            )}

        </div>
        {/* Post Options */}

        <PostOptions postId={post._id} post={post} />


    </div>
  )
}

export default Post