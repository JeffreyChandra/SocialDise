import { Calendar, MapPin, Settings, Shield, User } from "lucide-react";
import ProfilePost from "../components/ProfilePost";
import { useEffect, useState } from "react";
import API from "../api/axios";
import type { Post } from "../helper/interface";
import PostSkeleton from "../components/PostSkeleton";

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem("user")!);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.post("posts/by-user", {
          userId: user.id,
        });
        setPosts(res.data);
        console.log("Success:", res.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);
  return (
    <div className="grid grid-cols-12 gap-x-6 bg-neutral-bg w-full py-4">
      <div className=" col-span-12 px-2">
        <div className="max-w-[500px] mx-auto rounded-xl overflow-hidden shadow-md animate-slideInDown-enter">
          <div className="h-30 bg-linear-to-r from-primary-indigo-600 via-secondary-violet to-secondary-blue relative">
            <div className="animate-popUpDelay-enter opacity-0 absolute z-10 w-18 h-18 bg-[#c1c3c6] rounded-full left-4 bottom-0 translate-y-1/2 border-2 border-white flex justify-center items-center">
              <User className="w-8 h-8 stroke-[#76787e]" />
            </div>
          </div>
          <div className="bg-white relative text-small pt-9 px-5 pb-5">
            <div className="absolute font-medium flex items-center gap-1 bg-primary-indigo-500 text-white py-1 px-3 rounded-md right-4 top-3 hover:bg-primary-indigo-600 hover:scale-[1.02] cursor-default transition-all duration-200">
              <Settings className="stroke-white w-3 h-3" /> Edit Profile
            </div>
            <div className="mt-1 w-full xs:w-[60%] mb-3">
              <div className="text-body1 font-bold mb-1">{user.name}</div>
              <div className="mb-2">{user.email}</div>
              <div className="mb-2">
                Creative photographer 📸 | Travel enthusiast 🌍 | Coffee lover
                ☕ Sharing authentic moments from around the world
              </div>
              <div className="flex gap-2 text-verySmall text-neutral-textSecondary">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> San Francisco, CA
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Joined March 2024
                </div>
                <div className="flex items-center gap-1 text-status-success">
                  <Shield className="w-3 h-3 stroke-status-success" /> Verified
                  Creator
                </div>
              </div>
            </div>
            <div className="h-px w-full bg-neutral-border"></div>
            <div className="mt-3 w-full xs:w-[60%] flex gap-4">
              <div className="flex flex-col items-center ">
                <div className="text-caption font-bold">{posts.length}</div>
                <div className="text-neutral-textPrimary">
                  {posts.length > 1 ? "Posts" : "Post"}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-caption font-bold">{user.followers}</div>
                <div className="text-neutral-textPrimary">Followers</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-caption font-bold">{user.following}</div>
                <div className="text-neutral-textPrimary">Following</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-caption font-bold text-status-success">
                  93%
                </div>
                <div className="text-neutral-textPrimary">Avg. Trust</div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[500px] mx-auto grid grid-cols-3 gap-3 mt-2 animate-fadeUpDelay-enter opacity-0">
          <div className="col-span-3 h-12 bg-white shadow rounded-t-lg flex justify-center items-center font-bold">
            Posts
          </div>
          {isLoading ? (
            <>
              <PostSkeleton classname="rounded-md overflow-hidden aspect-square" />
              <PostSkeleton classname="rounded-md overflow-hidden aspect-square" />
              <PostSkeleton classname="rounded-md overflow-hidden aspect-square" />
            </>
          ) : (
            posts.map((post, index) => <ProfilePost key={index} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
