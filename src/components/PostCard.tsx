import {
  AlertTriangle,
  Ellipsis,
  Heart,
  MessageCircle,
  Send,
  Share2,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import type { Post } from "../helper/interface";
import { useState } from "react";
import API from "../api/axios";

interface Comment {
  author: string;
  id: number;
  content: string;
  user: {
    name: string;
    email: string;
  };
}

const PostCard = ({ post }: { post: Post }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getMediaType = (url: string) => {
    const cleanUrl = url.toLowerCase().split("?")[0];
    if (/\.(jpg|jpeg|png|gif|bmp|webp|tiff|svg)$/.test(cleanUrl)) {
      return "image";
    } else if (/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/.test(cleanUrl)) {
      return "video";
    }
    return "unknown";
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await API.post(
        `posts/${post.id}/comments`,
        { 
          author: user.name || "Anonymous",
          content: commentText 
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      
      setComments([...comments, res.data]);
      setCommentText("");
    } catch (error: any) {
      if (error.response?.status === 400) {
        setErrorMessage("Your comment was blocked due to inappropriate content.");
      } else {
        setErrorMessage("Failed to post comment. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPostSafe = post.isSafe !== false;
  const trustScore = Number(post.trustedScore) * 100;

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
        {isPostSafe ? (
          <div className="absolute top-2 right-2 flex gap-1 items-center bg-[#f4fff1] border border-status-success px-2 py-1 rounded-2xl text-[#13843c] font-medium">
            <ShieldCheck className="w-3 h-3 stroke-2" />{" "}
            <span>Genuine {trustScore.toFixed(0)}%</span>
          </div>
        ) : (
          <div className="absolute top-2 right-2 flex gap-1 items-center bg-[#fee0e0] border border-status-danger px-2 py-1 rounded-2xl text-[#841313] font-medium">
            <AlertTriangle className="w-3 h-3 stroke-2" />{" "}
            <span>AI Content Warning</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 text-neutral-textSecondary px-2 py-3">
        <div className="flex items-center gap-1 cursor-pointer">
          <Heart className="w-4 h-4 stroke-neutral-textSecondary hover:stroke-status-danger" />
          {post.likesCount}
        </div>
        <div 
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="w-4 h-4 stroke-neutral-textSecondary hover:stroke-status-info" />
          {comments.length}
        </div>
        <div>
          <Share2 className="w-4 h-4 stroke-neutral-textSecondary hover:stroke-status-success cursor-pointer" />
        </div>
      </div>

      {showComments && (
        <div className="px-2 pb-3 border-t border-neutral-border animate-slideInUp-enter">
          {errorMessage && (
            <div className="mt-2 mb-2 p-2 bg-[#fee0e0] border border-status-danger rounded-lg flex items-center justify-between text-[#841313] animate-scaleUp-enter">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>{errorMessage}</span>
              </div>
              <X 
                className="w-4 h-4 cursor-pointer hover:opacity-70" 
                onClick={() => setErrorMessage(null)}
              />
            </div>
          )}

          <div className="flex items-center gap-2 mt-3">
            <div className="p-1 bg-neutral-textSecondary rounded-full">
              <User className="w-3 h-3 stroke-neutral-border" />
            </div>
            <div className="flex-1 flex items-center border border-neutral-border rounded-lg overflow-hidden focus-within:border-status-info focus-within:ring-1 focus-within:ring-status-info transition-all duration-200">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
                placeholder="Write a comment..."
                className="flex-1 px-2 py-1.5 text-verySmall focus:outline-none"
                disabled={isSubmitting}
              />
              <button
                onClick={handleSubmitComment}
                disabled={isSubmitting || !commentText.trim()}
                className="px-2 py-1.5 bg-primary-indigo-500 text-white disabled:opacity-50 hover:bg-primary-indigo-600 transition-colors duration-200"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>

          {comments.length > 0 && (
            <div className="mt-3 space-y-2">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <div className="p-1 bg-neutral-textSecondary rounded-full h-fit">
                    <User className="w-2 h-2 stroke-neutral-border" />
                  </div>
                  <div className="flex-1 bg-neutral-bg rounded-lg p-2">
                    <div className="font-semibold text-verySmall">{comment.author || "User"}</div>
                    <div className="text-verySmall">{comment.content}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
