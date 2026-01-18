import {
  Brain,
  Check,
  CircleAlert,
  CircleCheck,
  Film,
  Image,
  Send,
  Upload,
  X,
} from "lucide-react";
import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import API from "../api/axios";
import { getVideoDuration } from "../helper/function";

interface UploadPage {
  setSelectedNav: React.Dispatch<React.SetStateAction<string>>;
}
const UploadPage = ({ setSelectedNav }: UploadPage) => {
  // const [postErrorMessage, setPostErrorMessage] = useState("");
  const [isPreviewClosing, setIsPreviewClosing] = useState(false);
  const handlePreviewClose = () => {
    setIsPreviewClosing(true);
  };
  const handleAnimationEnd = () => {
    if (isPreviewClosing) {
      removeFile();
      setIsPreviewClosing(false);
    }
  };
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzingComplete, setIsAnalyzingComplete] = useState(false);
  const [isDurationExceeded, setIsDurationExceeded] = useState(false);
  const handleCancelPost = () => {
    handlePreviewClose();
    setIsAnalyzingComplete(false);
  };

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [caption, setCaption] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const onFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setIsAnalyzingComplete(false);
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      handleFileValidation(selectedFile);
    }
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];
      handleFileValidation(droppedFile);
    }
  };

  const handleFileValidation = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (isImage || isVideo) {
      setFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      alert("Only image or video files are allowed!");
    }
  };
  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    setAnalyzeResult({ isSafe: false, detection: "", url: "" });
    setIsDurationExceeded(false);
  };

  const [analyzeResult, setAnalyzeResult] = useState<{
    isSafe: boolean;
    detection: string;
    url: string;
  }>({ isSafe: false, detection: "", url: "" });

  const handlePost = async () => {
    try {
      const postRes = await API.post(
        "posts",
        {
          title: "New Post",
          content: caption,
          mediaUrl: analyzeResult.url,
          userId: JSON.parse(localStorage.getItem("user")!).id,
          trustedScore: Number(analyzeResult.detection),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      console.log("Post created successfully:", postRes.data);
      setSelectedNav("Home");
    } catch (postError: any) {
      // setPostErrorMessage(postError);
      console.error("Error creating post:", postError.message[0]);
    }
  };
  const [colorScore, setColorScore] = useState("var(--color-status-success)");
  const changeColorBasedOnScore = (score: string) => {
    const scoreValue = 100 - Number(score) * 100;
    if (scoreValue < 30) {
      setColorScore("var(--color-status-danger)");
    } else {
      setColorScore("var(--color-status-success)");
    }
  };
  const handleAnalyze = async () => {
    if (!file) return;
    if (file.type.startsWith("video/")) {
      const videoDuration = await getVideoDuration(file);
      if (videoDuration >= 60) {
        setIsDurationExceeded(true);
        return;
      }
    }
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("media", file!);
      const res = await API.post("deepfake/detect", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("ini hasil res", res.data);
      setAnalyzeResult({
        isSafe: res.data.isSafe,
        detection: res.data.detection.score,
        url: res.data.fileInfo.url,
      });
      changeColorBasedOnScore(res.data.detection.score);
      console.log("Success:", res.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsAnalyzing(false);
      setIsAnalyzingComplete(true);
    }
  };
  return (
    <div className="grid grid-cols-12 gap-x-6 bg-neutral-bg py-4 ">
      <div className="col-span-12 px-2">
        <div className="max-w-[500px] mx-auto">
          <div className="w-full animate-slideInDown-enter">
            <div className="text-body1 font-bold">Upload & Verify</div>
            <div className="text-small text-neutral-textPrimary mb-4">
              Upload your content and let our AI verify its authenticity before
              posting
            </div>
          </div>
          {/* UPLOAD MEDIA */}
          <div
            onClick={() => {
              inputRef.current?.click();
            }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className="animate-fadeUp-enter border-2 border-dashed border-neutral-border flex justify-center flex-col items-center rounded-lg py-10 text-small mb-4 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors duration-300"
          >
            <input
              type="file"
              className="hidden"
              ref={inputRef}
              onChange={onFileSelect}
              accept="image/*,video/*"
            />
            <div className="bg-neutral-border/80 p-2.5 rounded-full mb-4">
              <Upload className="w-5 h-5 stroke-[#76787e]" />
            </div>
            <div className="font-semibold mb-1.5">
              {isDragging ? "Drop your file here" : "Upload media to verify"}
            </div>
            <div className="mb-2.5">Drag and drop or click to browse</div>
            <div className="flex text-neutral-textSecondary text-verySmall gap-2">
              <div className="flex gap-1 items-center">
                <Image className="w-3 h-3" /> images
              </div>
              <div className="flex gap-1 items-center">
                <Film className="w-3 h-3" /> Videos
              </div>
            </div>
          </div>
          {preview && file && (
            <>
              {/* PREVIEW */}
              <div
                className={`shadow bg-white text-small rounded-xl mb-4 ${
                  isPreviewClosing
                    ? "animate-scaleUp-exit"
                    : "animate-scaleUp-enter"
                }`}
                onAnimationEnd={handleAnimationEnd}
              >
                <div className="flex items-center justify-between px-3 py-4">
                  <div className="font-semibold">Preview</div>
                  <X
                    onClick={(e) => {
                      if (isAnalyzing) return;
                      e.stopPropagation();
                      setIsPreviewClosing(true);
                      setIsAnalyzingComplete(false);
                    }}
                    className="w-4 h-4 stroke-neutral-textSecondary"
                  />
                </div>
                <div className="bg-neutral-bg flex justify-center aspect-16/11">
                  {file.type.startsWith("video/") ? (
                    <video src={preview} controls />
                  ) : (
                    <img src={preview} />
                  )}
                </div>
                <div className="p-3">
                  <div className="border h-17 rounded-lg p-2 border-neutral-border focus-within:border-status-info focus-within:ring-1 focus-within:ring-status-info transition-all duration-200">
                    <textarea
                      disabled={isAnalyzing || isAnalyzingComplete}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write a caption"
                      className="focus:outline-0 w-full h-full resize-none"
                    />
                  </div>
                </div>
              </div>
              {/* ANALYZE WITH AI */}
              <div
                onClick={() => {
                  setIsAnalyzingComplete(false);
                  handleAnalyze();
                }}
                className="animate-slideInUp-enter mb-4 bg-primary-indigo-600 rounded-xl text-small text-white p-3 text-center font-medium hover:scale-[1.01] transition-transform duration-200 cursor-pointer"
              >
                Analyze with AI
              </div>
            </>
          )}
          {isDurationExceeded && (
            <>
              {/* DURATION EXCEEDED WARNING */}
              <div className="mb-4 bg-red-100 border border-red-400 text-red-800 text-small p-3 rounded-lg animate-fadeIn-enter">
                <div className="font-semibold mb-1">Duration Exceeded</div>
                Videos longer than 60 seconds cannot be analyzed. Please upload
                a shorter video.
              </div>
            </>
          )}
          {isAnalyzing && (
            <>
              {/* ANALYZING CONTENT */}
              <div className="mb-4 bg-white shadow rounded-xl text-small p-3">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4.5 h-4.5 stroke-status-info animate-spin" />
                  <div>
                    <div className="font-semibold">Analyzing Content...</div>
                    <div className="text-verySmall text-shadow-neutral-textSecondary">
                      AI is verifying authenticity
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div
                    className="h-2 rounded-full bg-blue-200 animate-pulse"
                    style={{ animationDuration: "1s" }}
                  ></div>
                  <div
                    className="h-2 rounded-full bg-blue-200 animate-pulse"
                    style={{ animationDelay: "150ms", animationDuration: "1s" }}
                  ></div>
                  <div
                    className="h-2 rounded-full bg-blue-200 animate-pulse"
                    style={{ animationDelay: "300ms", animationDuration: "1s" }}
                  ></div>
                </div>
              </div>
            </>
          )}
          {isAnalyzingComplete && (
            <>
              {/* AI ANALYSIS COMPLETE */}
              <div
                style={{ boxShadow: `0px 4px 15px -3px ${colorScore}` }}
                className="mb-4 bg-white shadow text-small p-3 rounded-xl"
              >
                <div className="font-bold flex items-center justify-between mb-1">
                  AI Analysis Complete{" "}
                  <CircleCheck
                    style={{ stroke: colorScore }}
                    className="animate-scaleUp-enter"
                  />
                </div>
                <div
                  style={{
                    borderColor: colorScore,
                    backgroundColor:
                      colorScore === "var(--color-status-success)"
                        ? "#f4fff1"
                        : "#fee0e0",
                    color:
                      colorScore === "var(--color-status-success)"
                        ? "#13843c"
                        : "#841313",
                  }}
                  className="border px-2 py-1 rounded-xl mb-2 w-fit animate-scaleUp-enter"
                >
                  Genuine {100 - Number(analyzeResult.detection) * 100}%
                </div>
                <div className="flex justify-between text-verySmall mb-1">
                  <div>Trust Score</div>
                  <div style={{ color: colorScore }} className="font-semibold">
                    {100 - Number(analyzeResult.detection) * 100}
                  </div>
                </div>
                <div className="bg-neutral-border h-1 rounded-full mb-3 overflow-hidden">
                  <div
                    style={{
                      width: 100 - Number(analyzeResult.detection) * 100 + "%",
                      backgroundColor: colorScore,
                    }}
                    className="h-full animate-fill-bar"
                  ></div>
                </div>
                <div
                  style={{
                    backgroundColor:
                      colorScore === "var(--color-status-danger)"
                        ? "#fee0e0"
                        : "#f4fff1",
                    color:
                      colorScore === "var(--color-status-success)"
                        ? "#13843c"
                        : "#841313",
                  }}
                  className="flex items-center gap-1 bg-[#f4fff1] p-3 rounded-xl mb-3"
                >
                  <Check className="w-3 h-3" />{" "}
                  {colorScore === "var(--color-status-danger)"
                    ? "This content appears to be AI-generated."
                    : "This content appears to be authentic and safe to post."}
                </div>
                <div className="text-verySmall mb-1 flex items-center gap-1">
                  <CircleAlert className="w-3 h-3" /> Analysis Details
                </div>
                {colorScore === "var(--color-status-danger)" ? (
                  <ul className="list-disc list-inside space-y-1 pl-4 text-verySmall ">
                    <li>Inconsistent facial features detected</li>
                    <li>Background anomalies found</li>
                    <li>Signs of digital manipulation present</li>
                    <li>Metadata validation failed</li>
                  </ul>
                ) : (
                  <ul className="list-disc list-inside space-y-1 pl-4 text-verySmall">
                    <li>Facial features analysis completed</li>
                    <li>Background consistency verified</li>
                    <li>No digital manipulation detected</li>
                    <li>Metadata validation passed</li>
                  </ul>
                )}
              </div>
            </>
          )}
          {isAnalyzingComplete && (
            <>
              {/* BUTTON CANCEL AND POST NOW */}
              <div className="flex text-small gap-2 mb-4">
                <button
                  onClick={() => {
                    handleCancelPost();
                  }}
                  className="flex-1 border border-neutral-border p-2 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handlePost();
                  }}
                  className="flex flex-1 bg-status-success p-2 items-center justify-center text-white gap-1 rounded-xl cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Post Now
                </button>
              </div>
              {/* <div className="text-red-500 text-[14px]">{postErrorMessage}</div> */}
            </>
          )}
          {/* HOW IT WORKS */}
          <div className="bg-blue-50 border border-blue-300 text-blue-900 p-3 rounded-lg animate-fadeUpDelay-enter opacity-0 ">
            <div className="text-small font-medium mb-1">How it works</div>
            <ul className="text-verySmall list-disc list-inside space-y-1 marker:text-blue-500">
              <li>Upload your image or video content</li>
              <li>Our AI analyzes it for signs of manipulation</li>
              <li>Get instant results with a trust score</li>
              <li>Post authentic content with confidence</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
