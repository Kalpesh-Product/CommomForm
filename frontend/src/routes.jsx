import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import MainPage from "./pages/MainPage";
import Listings from "./pages/Listings";
import ReusableComponents from "./pages/ReusableComponents";
import NomadLayout from "./pages/NomadLayout";
import Product from "./pages/Product";
import Contact from "./pages/Contact";
import Career from "./pages/Career";
import JobDetails from "./pages/JobDetails";
import GlobalListings from "./pages/GlobalListings";
import DestinationNews from "./pages/DestinationNews";
import LocalBlog from "./pages/LocalBlog";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ImageGallery from "./pages/ImageGallery";
import BlogDetails from "./pages/BlogDetails";

// Host imports
import HostLayout from "./pages/host/Layout";
import HostHome from "./pages/host/Home";
import HostContact from "./pages/host/Contact";
import HostCareer from "./pages/host/Career";
import HostLogin from "./pages/host/Login";
import HostSignup from "./pages/host/Signup";
import Modules from "./pages/host/Modules";
import Themes from "./pages/host/Themes";
import Capital from "./pages/host/Capital";
import HostAbout from "./pages/host/HostAbout";
import HostTermsAndConditions from "./pages/host/TermsAndConditions";
import HostPrivacy from "./pages/host/Privacy";
import HostFAQ from "./pages/host/FAQ";
import Leads from "./pages/host/Leads";
import HostProduct from "./pages/host/Product";

// Tenant imports
import TemplateSite from "./pages/company/TemplateSite";
import TemplateHome from "./pages/company/TemplateHome";
import NomadAbout from "./pages/NomadAbout";
import Profile from "./pages/Profile";
import PersistLogin from "./layout/PersistsLogin";
import Favorites from "./pages/Favorites";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ContentAndCopyright from "./pages/host/ContentAndCopyright";
import ContentUseRemoval from "./pages/host/ContentUseRemoval";
import NomadContentAndCopyright from "./pages/NomadContentAndCopyright";
import NomadContentUseRemoval from "./pages/NomadContentUseRemoval";
import NomadPrivacy from "./pages/NomadPrivacy";
import NomadFAQ from "./pages/NomadFAQ";
import NomadTermsAndConditions from "./pages/NomadTermsAndConditions";
import SiteIsDown from "./pages/SiteIsDown";
import WebsiteUnderMaintenance from "./pages/WebsiteUnderMaintenance";

// function getTenantFromHost() {
//   const hostname = window.location.hostname; // e.g. "nomad.wono.co" or "nomad.localhost"
//   const rootDomain = "wono.co";

//   // Case 1: main site (no subdomain or localhost root)
//   if (
//     hostname === rootDomain ||
//     hostname === `www.${rootDomain}` ||
//     hostname === "localhost" ||
//     hostname.startsWith("localhost:")
//   ) {
//     return "main";
//   }

//   // Case 2: production subdomains (*.wono.co)
//   if (hostname.endsWith(`.${rootDomain}`)) {
//     return hostname.replace(`.${rootDomain}`, "");
//   }

//   // Case 3: dev subdomains (*.localhost)
//   if (hostname.endsWith(".localhost")) {
//     return hostname.replace(".localhost", "");
//   }

//   return null;
// }

// const tenant = getTenantFromHost();

// let routerConfig = [];

const routerConfig = [
  // ===== Main marketing site =====
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "home", element: <Home /> },
      { path: "site-is-down", element: <SiteIsDown /> },
      {
        path: "website-under-maintenance",
        element: <WebsiteUnderMaintenance />,
      },
    ],
  },

  // ===== Nomad site =====
  {
    element: <PersistLogin />,
    children: [
      {
        path: "/college",
        element: <NomadLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "verticals", element: <GlobalListings /> },
          { path: "listings", element: <Listings /> },
          { path: "listings/:company", element: <Product /> },
          { path: "listings/:company/images", element: <ImageGallery /> },
          { path: "components", element: <ReusableComponents /> },
          { path: "contact", element: <Contact /> },
          { path: "news", element: <DestinationNews /> },
          { path: "news/news-details", element: <BlogDetails /> },
          { path: "blog", element: <LocalBlog /> },
          { path: "blog/blog-details", element: <BlogDetails /> },
          { path: "career", element: <Career /> },
          { path: "career/job/:title", element: <JobDetails /> },
          { path: "login", element: <Login /> },
          { path: "forgot-password", element: <ForgotPassword /> },
          { path: "reset-password/:token", element: <ResetPassword /> },
          { path: "signup", element: <HostSignup /> },
          { path: "about", element: <NomadAbout /> },
          {
            path: "terms-and-conditions",
            element: <NomadTermsAndConditions />,
          },
          {
            path: "content-and-copyright",
            element: <NomadContentAndCopyright />,
          },
          { path: "content-use-removal", element: <NomadContentUseRemoval /> },
          { path: "privacy", element: <NomadPrivacy /> },
          { path: "faq", element: <NomadFAQ /> },
          { path: "profile", element: <Profile /> },
          { path: "favorites", element: <Favorites /> },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routerConfig);

export default router;
