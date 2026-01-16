import ScrollToTop from "./ScrollToTop";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="text-neutral-textPrimary">
      <ScrollToTop />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
