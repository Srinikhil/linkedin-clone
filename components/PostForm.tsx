'use client'

import { useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ImageIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import createPostAction from "@/actions/createPostAction";
import { toast } from "sonner";

function PostForm() {

    const ref = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {user} = useUser();
    const [preview, setPreview] = useState<string | null>(null);

    const handlePostAction = async (formData: FormData) => {
        const formDataCopy = formData;
        ref.current?.reset();

        const text = formDataCopy.get("postInput") as string;

        if (!text.trim()) {
            throw new Error("Please provide a valid post input");
        }

        setPreview(null);

        try {
            await createPostAction(formDataCopy)
        } catch (error) {
            console.log("Error creating post: ", error)
        }

    }



    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file))

        }
    };


  return (
    <div className="mb-2">
        <form ref={ref} 
            action={(formData) => {
                // Handle form submission
                const promise = handlePostAction(formData);

                // Toast notification based on promise above
                toast.promise(promise, {
                    loading: "Creating the post ...",
                    success: "Post Created !!",
                    error: "Failed to create the post",   
                });

            }} 
            className="p-3 bg-white rounded-lg border"
        >
            <div className="flex items-center space-x-2">
            <Avatar>
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                </AvatarFallback>
            </Avatar>

            <input  
                type="text"
                name="postInput"
                placeholder="Start writing a post..."
                className="flex-1 outline-none rounded-full py-3 px-4 border"
            />

            <input 
                ref={fileInputRef}
                type="file" 
                name="image" 
                accept="image/*" 
                hidden 
                onChange={handleImageChange}
            />

            <button type="submit" hidden>
                Post
            </button>



            </div>
            {/* Preview */}
            {preview && (
                <div className="mt-3">
                    <img src={preview} alt="preview" className="w-full object-cover" />
                </div>
            )}


            <div className="flex justify-end mt-2 space-x-2"> 
                <Button type='button' 
                    variant={preview ? "secondary": "outline"} 
                    onClick={() => fileInputRef.current?.click()}
                >
                    <ImageIcon className="mr-2" size={16} color="currentColor" />
                    {preview ? "Change" : "Add"} Image
                </Button>
                
                {preview && (
                    <Button variant="outline" type="button" onClick={() => setPreview(null)}>
                        <XIcon className="mr-2" size={16} color="currentColor" />
                        Remove Image
                    </Button>
                )}

            </div>
            




        </form>

        <hr className="mt-2 border-gray-300"/>

    </div>
  )
}

export default PostForm