import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/login/Login";
import Profile from "../pages/profile/Profile";
import Register from "../pages/register/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import ScheduleMeeting from "../pages/schedule-meeting/ScheduleMeeting";
import EditMeeting from "../pages/edit-meeting/EditMeeting";
import VideoConference from "../pages/video-conference/VideoConference";
import SiteMap from "../pages/sitemap/SiteMap";
import AboutUs from "../pages/about-us/AboutUs";
import Support from "../pages/support/Support";
export const routes = [
    {
        path: "/",
        element: <Navigate to="/login" replace />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/profile",
        element: <Profile />,
    },
    {
        path: "/register",
        element: <Register />,   
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
    },
    {
        path: "/schedule-meeting",
        element: <ScheduleMeeting />,
    },
    {
        path: "/edit-meeting/:meetingId",
        element: <EditMeeting />,
    },
    {
        path: "/conference/:meetingId",
        element: <VideoConference />,
    },
    {
        path: "/sitemap",
        element: <SiteMap />,
    },
    {
        path: "/about",
        element: <AboutUs />,
    },
    {
        path: "/support",
        element: <Support />,
    },
]

export const router = createBrowserRouter(routes);
