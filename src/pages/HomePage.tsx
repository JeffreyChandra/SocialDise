import { Sparkles } from "lucide-react";
import PostCard from "../components/PostCard";
import type { Post } from "../helper/interface";
import { useEffect, useState } from "react";
import API from "../api/axios";
import PostSkeleton from "../components/PostSkeleton";

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fetchPosts = async () => {
    try {
      const res = await API.get("posts");
      setPosts(res.data);
      console.log("Success:", res.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <div className="grid grid-cols-12 w-full gap-x-6 bg-neutral-bg py-4">
      <div className="px-2 col-span-12 flex flex-col gap-y-4 items-center">
        <div className="w-full max-w-[500px] bg-primary-indigo-500 text-white flex gap-2 p-4 rounded-lg animate-slideInDown-enter">
          <Sparkles className="w-5 h-5" />
          <div>
            <div className="text-caption font-semibold">
              Welcome to Social Dise
            </div>
            <div className="text-small">
              Every post is verified by our AI to ensure authenticity. Browse
              with confidence!
            </div>
          </div>
        </div>
        {isLoading ? (
          <div>
            <PostSkeleton classname="w-[500px] h-[400px] rounded-lg mb-4" />
            <PostSkeleton classname="w-[500px] h-[400px] rounded-lg mb-4" />
          </div>
        ) : (
          <div className="w-full max-w-[500px] ">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
