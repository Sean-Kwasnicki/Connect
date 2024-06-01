import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import Server from "../components/Server";
import Channel from "../components/Channel";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "servers/:serverId",
        element: <Server />,
        children: [
          {
            path: "channels/:channelId",
            element: <Channel />,
          },
        ],
      },
    ],
  },
]);
