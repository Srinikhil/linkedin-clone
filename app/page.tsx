import PostFeed from "@/components/PostFeed";
import PostForm from "@/components/PostForm";
import UserInformation from "@/components/UserInformation";
import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { SignedIn } from "@clerk/nextjs";
import { User } from "lucide-react";

export const revalidate = 0;

export default async function Home() {

  await connectDB();

  const posts = await Post.getAllPosts();
  // console.log(posts);




  return (
    <div className="grid grid-cols-8 mt-5 sm:px-5">
      <section className="hidden md:inline md:col-span-2">
          {/* User Info */}
          <UserInformation />
      </section>

      <section className="col-span-full md:col-span-6 xl:col-span-4 xl:max-w-xl mx-auto w-full">
        {/* Post form */}
        <SignedIn>
          <PostForm />
        </SignedIn>
        
        
        {/* Posts */}
        <PostFeed 
          posts={ posts }
        />

      </section>

      <section className="hidden xl:inline justify-center col-span-2">
          {/* widgets */}
      </section>

    </div>
  );
}
