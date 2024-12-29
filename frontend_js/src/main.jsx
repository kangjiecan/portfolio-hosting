import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Home from "./routes/Home.jsx";
import Details from "./routes/Details.jsx";
import Login from "./routes/Login.jsx";
//import Logout from './routes/Logout.jsx';
import Create from "./routes/Create.jsx";
import About from "./routes/About.jsx";
import Posts from "./routes/Posts.jsx";
import Media from "./routes/Media.jsx";
import EditPost from "./routes/EditPost.jsx";
//import VerifyEmail from './routes/VerifyEmail.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/details/:postId", element: <Details /> },
      { path: "/login", element: <Login /> },
      //{ path: '/logout', element: <Logout /> },
      { path: "/Create", element: <Create /> },
      { path: "/about", element: <About /> },
      { path: "/Home/", element: <Home /> },
      { path: "/posts/:nickname/:userID", element: <Posts /> },
      { path: "/media", element: <Media /> },
      { path: "/editpost/:postID", element: <EditPost /> },
      //{path:'/VerifyEmail',element:<VerifyEmail/>}
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
