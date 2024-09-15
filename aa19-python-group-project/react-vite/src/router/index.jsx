import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import Server from "../components/Server";
import Channel from "../components/Channel";
import MessagesPage from "../components/Messages/MessagesPage";
import DirectMessages from "../components/DirectMessages/DirectMessages";
import DirectMessagesPage from "../components/DirectMessages/DirectMessagesPage";
import ThreadsPage from "../components/Threads/ThreadsPage";
import HomeScreen from "./HomeScreen";
import HomeScreenStyles from "./HomeScreen.module.css";
import ChannelScreenStyle from "./ChannelScreen.module.css";

export const router = createBrowserRouter([
  { path: "/signup", element: <SignupFormPage /> },
  { path: "/login", element: <LoginFormPage /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomeScreen s={HomeScreenStyles} />,
      },
      {
        path: "direct_messages/",
        element: <DirectMessages />,
        children: [
          {
            path: ":userId",
            element: <DirectMessagesPage />,
          },
        ],
      },
      {
        path: "servers/:serverId",
        element: <Server />,
        children: [
          {
            path: "",
            element: <HomeScreen s={ChannelScreenStyle} />,
          },
          {
            path: "channels/:channelId",
            element: <Channel />,
            children: [
              {
                path: "messages",
                element: <MessagesPage />,
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
