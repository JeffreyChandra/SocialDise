import { Check, Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isAgreeTerms, setIsAgreeTerms] = useState(false);
  const moveToLogin = () => {
    navigate("/login");
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const validateName = () => {
    let isValid = false;
    if (!name) {
      setNameError("Full name is required");
    } else {
      isValid = true;
    }
    return isValid;
  };
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
  const validateConfirmPassword = () => {
    let isValid = false;
    if (!confirmPassword) {
      setConfirmPasswordError("Confirm Password is required");
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      isValid = true;
    }
    return isValid;
  };

  const validateForm = async () => {
    let nameValid = validateName();
    let emailValid = validateEmail();
    let passwordValid = validatePassword();
    let confirmPasswordValid = validateConfirmPassword();
    if (nameValid && emailValid && passwordValid && confirmPasswordValid) {
      if (!isAgreeTerms) {
        alert("You must agree to the Terms of Service and Privacy Policy");
        return;
      }
      try {
        const res = await API.post("auth/register", {
          name: name,
          email: email,
          password: password,
        });
        console.log("Success:", res.data);
        navigate("/login", { replace: true });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  const handleSubmit = () => {
    validateForm();
  };
  const clearErrors = () => {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  return (
    <div className="bg-neutral-bg w-full grid grid-cols-12 gap-x-6 h-screen ">
      <div className="col-span-12 items-center justify-center flex">
        <div className="flex flex-col items-center ">
          <div className="bg-primary-indigo-600 p-2 rounded-lg mb-2 bg-linear-to-br from-primary-indigo-600 to-secondary-violet animate-popUp-enter">
            <Shield className="stroke-white" />
          </div>
          <div className="text-center animate-slideInUp-enter">
            <div className="text-[20px] font-bold">Join Social Dise</div>
            <div className="text-small mb-5">
              Create your secure, verified account
            </div>
          </div>
          <div className="shadow-lg bg-neutral-whiteSf py-4 px-5 rounded-lg text-small w-full text-neutral-textPrimary mb-3 animate-scaleUp-enter">
            <div>Full Name</div>
            <div className=" text-neutral-textSecondary flex items-center gap-1 border rounded-lg px-2 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <Mail className="w-4 h-4 stroke-1" />
              <input
                onChange={(value) => {
                  setName(value.target.value);
                  clearErrors();
                }}
                value={name}
                className="w-full focus:outline-0 "
                placeholder="Jansen Ong"
              ></input>
            </div>
            <div className="text-status-danger text-verySmall font-bold">
              {nameError}
            </div>
            <div className="mt-2">Email</div>
            <div className=" text-neutral-textSecondary flex items-center gap-1 border rounded-lg px-2 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <Mail className="w-4 h-4 stroke-1" />
              <input
                onChange={(value) => {
                  setEmail(value.target.value);
                  clearErrors();
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
                  setPassword(value.target.value);
                  clearErrors();
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
            <div className="mt-2">Confirm Password</div>
            <div className=" text-neutral-textSecondary flex items-center gap-1 border rounded-lg px-2 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <Lock className="w-4 h-4 stroke-1" />
              <input
                onChange={(value) => {
                  setConfirmPassword(value.target.value);
                  clearErrors();
                }}
                value={confirmPassword}
                type={isConfirmPasswordVisible ? "text" : "password"}
                className="w-full focus:outline-0 "
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              ></input>
              <div
                onClick={() => {
                  setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
                }}
              >
                {isConfirmPasswordVisible ? (
                  <EyeOff className="w-4 h-4 stroke-1"></EyeOff>
                ) : (
                  <Eye className="w-4 h-4 stroke-1"></Eye>
                )}
              </div>
            </div>
            <div className="text-status-danger text-verySmall font-bold">
              {confirmPasswordError}
            </div>
            <div className="flex items-center text-[9px] mb-3 gap-1 mt-2">
              <div
                onClick={() => {
                  setIsAgreeTerms(!isAgreeTerms);
                }}
                className={`h-2.5 w-2.5 cursor-pointer hover:scale-110 transition-transform duration-300 ${
                  isAgreeTerms ? "bg-primary-indigo-600" : "bg-black"
                }`}
              >
                {isAgreeTerms && (
                  <Check className="w-full h-full stroke-white" />
                )}
              </div>
              I agree to the Terms of Service and Privacy Policy
            </div>

            <button
              type="submit"
              onClick={() => {
                handleSubmit();
              }}
              className="bg-primary-indigo-600 text-white py-1.5 w-full rounded-lg mb-3 hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
            >
              Create Account
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="h-px bg-neutral-border flex-1"></div>
              <span className="text-neutral-textSecondary text-xs font-medium">
                or
              </span>
              <div className="h-px bg-neutral-border flex-1"></div>
            </div>
            <div className="text-center">
              Already have an account?{" "}
              <span
                onClick={() => {
                  moveToLogin();
                }}
                className="text-primary-indigo-600 cursor-pointer"
              >
                Sign in
              </span>
            </div>
          </div>
          <div className="flex text-small items-center gap-1 text-neutral-textSecondary animate-fadeUpDelay-enter opacity-0">
            <Shield className="stroke-status-success w-4 h-4" />
            <span>All content verified by advanced AI technology</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
