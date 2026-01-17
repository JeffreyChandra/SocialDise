import {
  Ellipsis,
  Heart,
  MessageCircle,
  Share2,
  ShieldCheck,
  User,
} from "lucide-react";
import type { Post } from "../helper/interface";

const PostCard = ({ post }: { post: Post }) => {
  console.log("ini post card:" + post.trustedScore);
  const getMediaType = (url: string) => {
    const cleanUrl = url.toLowerCase().split("?")[0];
    if (/\.(jpg|jpeg|png|gif|bmp|webp|tiff|svg)$/.test(cleanUrl)) {
      return "image";
    } else if (/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/.test(cleanUrl)) {
      return "video";
    }
    return "unknown";
  };
  return (
    <div className="rounded-lg bg-neutral-whiteSf shadow-[0px_0px_2px_0px_rgba(0,0,0,0.5)] text-small text-neutral-textPrimary mb-5 animate-slideInUp-enter">
      <div className="flex justify-between items-center p-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-neutral-textSecondary rounded-4xl">
            <User className="w-3.5 h-3.5 stroke-neutral-border" />
          </div>
          <div>
            <div className="font-semibold">{post.user.name}</div>
            <div className="text-neutral-textSecondary">
              {post.user.email}{" "}
              <span className="text-[0.4rem] align-middle">&bull;</span> 2h ago
            </div>
          </div>
        </div>
        <Ellipsis className="w-4 h-4 stroke-neutral-textSecondary" />
      </div>
      <div className="mb-2 px-2">{post.content}</div>
      <div className="bg-black aspect-16/11 relative">
        {getMediaType(post.mediaUrl) === "video" ? (
          <video
            className="object-cover h-full w-full"
            src={post.mediaUrl}
            controls
          ></video>
        ) : (
          <img className="object-cover h-full w-full" src={post.mediaUrl}></img>
        )}
        <div className="absolute top-2 right-2 flex gap-1 items-center bg-[#f4fff1] border border-status-success px-2 py-1 rounded-2xl text-[#13843c] font-medium">
          <ShieldCheck className="w-3 h-3 stroke-2" />{" "}
          <span>Genuine {100 - 100 * Number(post.trustedScore)}%</span>
        </div>
      </div>
      <div className=" flex items-center gap-4 text-neutral-textSecondary px-2 py-3">
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4 stroke-neutral-textSecondary hover:stroke-status-danger" />
          {post.likesCount}
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4 stroke-neutral-textSecondary hover:stroke-status-info" />
          {post.comments.length}
        </div>
        <div>
          <Share2 className="w-4 h-4 stroke-neutral-textSecondary hover:stroke-status-success" />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
