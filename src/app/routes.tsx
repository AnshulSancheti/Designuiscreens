import { createBrowserRouter } from "react-router";
import { InterviewRoom } from "./components/InterviewRoom";
import { PreInterviewScreen } from "./components/PreInterviewScreen";
import { UserDashboard } from "./components/UserDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: UserDashboard,
  },
  {
    path: "/pre-interview",
    Component: PreInterviewScreen,
  },
  {
    path: "/interview",
    Component: InterviewRoom,
  },
]);
