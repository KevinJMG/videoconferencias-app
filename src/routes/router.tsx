import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/login/Login";
import Profile from "../pages/profile/Profile";
import Register from "../pages/register/Register";
import Dashboard from "../pages/dashboard/Dashboard";
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
]

export const router = createBrowserRouter(routes);
