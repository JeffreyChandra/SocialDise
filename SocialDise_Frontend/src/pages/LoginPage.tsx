import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { isAxiosError } from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const moveToRegister = () => {
    navigate("/register");
  };
  const moveToHome = () => {
    navigate("/", { replace: true });
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const validateEmail = () => {
    let isValid = false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
    } else if (!regex.test(email)) {
      setEmailError("Invalid email format (e.g. user@domain.com)");
    } else {
      isValid = true;
    }
    return isValid;
  };
  const validatePassword = () => {
    let isValid = false;
    if (!password) {
      setPasswordError("Password is required");
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      isValid = true;
    }
    return isValid;
  };
  const validateForm = async () => {
    let emailValid = validateEmail();
    let passwordValid = validatePassword();
    if (emailValid && passwordValid) {
      try {
        const res = await API.post("auth/login", {
          email: email,
          password: password,
        });
        console.log("Success:", res.data);
        localStorage.setItem("access_token", res.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        moveToHome();
      } catch (error) {
        if (isAxiosError(error)) {
          console.error("Error:", error);
          if (error.response?.status === 401) {
            setEmailError("Invalid email");
            setPasswordError("Invalid password");
          }
        } else {
          console.error("Unknown Error:", error);
        }
      }
    }
  };
  const handleSubmit = () => {
    validateForm();
  };
  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
  };
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return (
    <div className="bg-neutral-bg w-full  grid grid-cols-12 gap-x-6 h-screen">
      <div className="col-span-12 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="bg-primary-indigo-600 p-2 rounded-lg mb-2 bg-linear-to-tl from-primary-indigo-600 to-secondary-violet animate-popUp-enter">
            <Shield className="stroke-white" />
          </div>
          <div className="animate-slideInUp-enter text-center">
            <div className="text-[20px] font-bold">Welcome to Social Dise</div>
            <div className="text-small mb-5">
              Authentic social media, verified by AI
            </div>
          </div>
          <div className="shadow-lg bg-neutral-whiteSf py-4 px-5 rounded-lg text-small w-full text-neutral-textPrimary mb-3 animate-scaleUp-enter">
            <div>Email</div>
            <div className="text-neutral-textSecondary flex items-center gap-1 border rounded-lg px-2 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <Mail className="w-4 h-4 stroke-1" />
              <input
                onChange={(value) => {
                  clearErrors();
                  setEmail(value.target.value);
                }}
                value={email}
                className="w-full focus:outline-0 "
                placeholder="you@example.com"
              ></input>
            </div>
            <div className="text-status-danger text-verySmall font-bold">
              {emailError}
            </div>
            <div className="mt-2">Password</div>
            <div className=" text-neutral-textSecondary flex items-center gap-1 border rounded-lg px-2 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <Lock className="w-4 h-4 stroke-1" />
              <input
                onChange={(value) => {
                  clearErrors();
                  setPassword(value.target.value);
                }}
                value={password}
                type={isPasswordVisible ? "text" : "password"}
                className="w-full focus:outline-0 "
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              ></input>
              <div
                onClick={() => {
                  setIsPasswordVisible(!isPasswordVisible);
                }}
              >
                {isPasswordVisible ? (
                  <EyeOff className="w-4 h-4 stroke-1"></EyeOff>
                ) : (
                  <Eye className="w-4 h-4 stroke-1"></Eye>
                )}
              </div>
            </div>
            <div className="text-status-danger text-verySmall font-bold">
              {passwordError}
            </div>

            <div
              className={`text-right text-primary-indigo-600 ${
                passwordError ? "" : "mt-2"
              } mb-3`}
            >
              Forgot password?
            </div>

            <button
              onClick={handleSubmit}
              className="bg-primary-indigo-600 text-white py-1.5 w-full rounded-lg mb-3 hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
            >
              Sign In
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="h-px bg-neutral-border flex-1"></div>

              <span className="text-neutral-textSecondary text-xs font-medium">
                or
              </span>

              <div className="h-px bg-neutral-border flex-1"></div>
            </div>
            <div className="text-center">
              Don't have an account?{" "}
              <span
                onClick={() => {
                  moveToRegister();
                }}
                className="text-primary-indigo-600 cursor-pointer"
              >
                Sign up
              </span>
            </div>
          </div>
          <div className="flex text-small items-center gap-1 text-neutral-textSecondary animate-fadeUpDelay-enter opacity-0">
            <Shield className="stroke-status-success w-4 h-4" />
            <span>Protected by AI deepfake detection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
