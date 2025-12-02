import { ShieldCheck } from "lucide-react";
import type { Post } from "../helper/interface";

const ProfilePost = ({ post }: { post: Post }) => {
  return (
    <div className="rounded-md overflow-hidden aspect-square group cursor-pointer relative">
      <img
        className="w-full h-full group-hover:scale-[1.09] transition-transform duration-200"
        src={post.mediaUrl}
        alt=""
      />
      <div className="absolute bg-black/40 inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-1"></div>
      <div className="rounded-md absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-2 bg-[#f4fff1] border border-status-success px-1 py-0.5">
        <ShieldCheck className="w-2 h-2 stroke-[#13843c]" />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-2 text-verySmall flex flex-col items-center justify-center">
        <div className="text-white font-medium ">❤️ {post.likesCount}</div>
        <div className="bg-[#f4fff1] border border-status-success px-2 py-1 text-[#13843c] rounded-xl">
          Genuine {(1 - Number(post.trustedScore)) * 100}%
        </div>
      </div>
    </div>
  );
};

export default ProfilePost;
