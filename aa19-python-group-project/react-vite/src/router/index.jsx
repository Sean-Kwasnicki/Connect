import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import Server from "../components/Server";
import Channel from "../components/Channel";
import MessagesPage from "../components/Messages/MessagesPage";
import DirectMessagesPage from "../components/DirectMessages/DirectMessagesPage";
import ThreadsPage from "../components/Threads/ThreadsPage";

export const router = createBrowserRouter([
  { path: "/signup", element: <SignupFormPage /> },
  { path: "/login", element: <LoginFormPage /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
      },
      {
        path: "servers/:serverId",
        element: <Server />,
        children: [
          {
            path: "channels/:channelId",
            element: <Channel />,
            children: [
              {
                path: "messages",
                element: <MessagesPage />,
              },
              {
                path: "direct-messages",
                element: <DirectMessagesPage />,
              },
              {
                path: "threads",
                element: <ThreadsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
