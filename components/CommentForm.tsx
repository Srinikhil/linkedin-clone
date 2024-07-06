"use client";

import { useUser } from "@clerk/nextjs"
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import createCommentAction from "@/actions/createCommentAction";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

function CommentForm( {postId}: {postId: string} ) {
    const { user } = useUser();
    const ref = useRef<HTMLFormElement>(null);


    console.log(`post ID: ${postId}`);
    const createCommentActionWithPostId = createCommentAction.bind(null, postId);
    

    const handleCommentAction = async (formData: FormData): Promise<void> => {
        const formDataCopy = formData;
        ref.current?.reset();        

        try {
            if(!user?.id) {
                throw new Error("User not authenticated");
            }
            console.log(`post ID: ${postId}`);
            await createCommentActionWithPostId(formDataCopy);
        } catch (error) {
            console.log(`Error creating comment: ${error}`)
        }
    };


    // TEMP
    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     const formData = new FormData(ref.current!);
    //     console.log(`Debug: post ID in handleSubmit: ${postId}`);
    //     await handleCommentAction(formData);
    // };


    return (
        <form
            ref={ref}
            action={(formData) => {
                const promise = handleCommentAction(formData);
                // console.log(`post ID: ${postId}`);

                toast.promise(promise, {
                    loading: "Creating the comment ...",
                    success: "Comment Created !!",
                    error: "Failed to create the comment",   
                });

            }}
            // onSubmit={handleSubmit}
            className="flex items-center space-x-1"
        >
            <Avatar>
                <AvatarImage src={ user?.imageUrl }/>
                <AvatarFallback>
                    { user?.firstName?.charAt(0) }
                    { user?.lastName?.charAt(0)}
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-1 bg-white border rounded-full px-3 py-2">
                <input 
                    type="text"
                    name="commentInput"
                    placeholder="Add a comment..."
                    className="outline-non flex-1 text-sm bg-transparent"
                />
                <button type="submit">
                    <Badge>
                        Post
                    </Badge>
                </button>
            </div>

        </form>
    )
}

export default CommentForm;