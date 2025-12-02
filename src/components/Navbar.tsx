import { Home, User, Shield, Upload, Bell, Search } from "lucide-react";
import { useState } from "react";
import HomePage from "../pages/HomePage";
import UploadPage from "../pages/UploadPage";
import ProfilePage from "../pages/ProfilePage";

const Navbar = () => {
  const [selectedNav, setSelectedNav] = useState<string>("Home");
  const navItems = [
    {
      icon: Home,
      text: "Home",
      component: <HomePage />,
    },
    {
      icon: Upload,
      text: "Upload",
      component: <UploadPage setSelectedNav={setSelectedNav} />,
    },
    {
      icon: User,
      text: "Profile",
      component: <ProfilePage />,
    },
  ];

  return (
    <div className="relative bg-neutral-bg pb-15">
      <div className="border-b-2 border-neutral-border w-full bg-white">
        <div className="max-w-5xl mx-auto w-full px-2 h-12 flex items-center justify-between bg-white ">
          <div className="flex gap-1 items-center">
            <Shield className="w-5 h-5 stroke-primary-indigo-600" />
            <div className="text-caption font-semibold text-transparent bg-linear-to-br from-primary-indigo-600 to-secondary-violet bg-clip-text">
              Social Dise
            </div>
          </div>
          <div className="hidden gap-1 sm:flex">
            {navItems.map((item, index) => (
              <div
                onClick={() => {
                  setSelectedNav(item.text);
                }}
                key={index}
                className={`flex items-center gap-1 hover:scale-[1.05] transition-all duration-300 ease-in-out px-2 py-1 rounded-md ${
                  selectedNav === item.text
                    ? "bg-[#EEF2FF] cursor-default"
                    : "hover:bg-neutral-bg cursor-pointer"
                }`}
              >
                <item.icon
                  className={`w-4 h-4 ${
                    selectedNav === item.text
                      ? "stroke-primary-indigo-600"
                      : "stroke-neutral-textSecondary"
                  }`}
                />
                <div
                  className={`text-small  ${
                    selectedNav === item.text
                      ? "text-primary-indigo-600"
                      : "text-neutral-textSecondary"
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="hover:bg-neutral-border transition-colors duration-200 p-1 rounded-full">
              <Bell className="w-4 h-4 stroke-neutral-textSecondary" />
            </div>
            <div className="hover:bg-neutral-border transition-colors duration-200 p-1 rounded-full">
              <Search className="w-4 h-4 stroke-neutral-textSecondary" />
            </div>
            <div className="p-1 bg-neutral-border rounded-full">
              <User className="w-4 h-4 stroke-neutral-textSecondary" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-neutral-bg min-h-[calc(100vh-50px)]">
        {navItems.find((item) => item.text === selectedNav)?.component}
      </div>
      <div className="text-neutral-textSecondary sm:hidden fixed flex items-center justify-around absolute border-t-2 border-neutral-border w-full bg-white h-13 z-10 bottom-0 ">
        {navItems.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedNav(item.text);
            }}
            className={`p-2 rounded-md hover:bg-neutral-bg transition-all duration-300 ease-in-out ${
              selectedNav === item.text
                ? "bg-[#EEF2FF] cursor-default"
                : "cursor-pointer"
            }`}
          >
            <item.icon
              className={`w-5 h-5 ${
                selectedNav === item.text
                  ? "stroke-primary-indigo-600"
                  : "stroke-neutral-textSecondary"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
