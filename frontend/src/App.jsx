import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  const location = useLocation();
  const contentRef = useRef(null);

  // ✅ Disable right-click globally (across all routes)
  useEffect(() => {
    const disableContextMenu = (e) => e.preventDefault();
    window.addEventListener("contextmenu", disableContextMenu);
    return () => window.removeEventListener("contextmenu", disableContextMenu);
  }, []);

  const isNomad = location.pathname.includes("/college");
  const isHost = location.pathname.includes("/hosts");
  const isRoot = location.pathname === "/";
  const showMainHeaderFooter = !(isNomad || isHost || isRoot);

  return (
    <div className="flex flex-col h-screen overflow-auto justify-between relative bg-white custom-scrollbar-hide">
      {showMainHeaderFooter && <Header />}
      <div
        // ref={contentRef}
        className={`flex flex-col gap-4 bg-white`}
      >
        <Outlet />
        <Toaster />
      </div>

      {showMainHeaderFooter && <Footer />}
    </div>
  );
};

export default App;
