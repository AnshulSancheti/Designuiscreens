import { createBrowserRouter, Navigate } from "react-router";
import { InterviewRoom } from "./components/InterviewRoom";
import { PreInterviewScreen } from "./components/PreInterviewScreen";
import { DashboardLayout } from "./components/DashboardLayout";
import { UserDashboard } from "./components/UserDashboard";
import { ApplicationsScreen } from "./components/ApplicationsScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { LandingPage } from "./components/LandingPage";
import { MatchesScreen } from "./components/MatchesScreen";
import { InterviewsScreen } from "./components/InterviewsScreen";
import { EmployerDashboard } from "./components/EmployerDashboard";
import { AuthPage } from "./components/AuthPage";
import { ChoosePathScreen } from "./components/ChoosePathScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/auth",
    Component: AuthPage,
  },
  {
    path: "/candidate/start",
    Component: ChoosePathScreen,
  },
  {
    path: "/candidate/start",
    Component: ChoosePathScreen,
  },
  {
    path: "/employer",
    Component: EmployerDashboard,
  },
  {
    path: "/candidate",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: UserDashboard,
      },
      {
        path: "applications",
        Component: ApplicationsScreen,
      },
      {
        path: "matches",
        Component: MatchesScreen,
      },
      {
        path: "interviews",
        Component: InterviewsScreen,
      },
      {
        path: "profile",
        Component: ProfileScreen,
      },
      {
        path: "settings",
        Component: SettingsScreen,
      },
    ],
  },
  {
    path: "/pre-interview",
    Component: PreInterviewScreen,
  },
  {
    path: "/interview",
    Component: InterviewRoom,
  },
  {
    path: "*",
    element: <Navigate to="/candidate" replace />
  }
]);