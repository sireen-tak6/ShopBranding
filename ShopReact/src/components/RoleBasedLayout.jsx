import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStateContext } from "../context/contextProvider";

const RoleBasedRoute = ({ allowedRoles, children }) => {
    const { user } = useStateContext();

    if (!user || !allowedRoles.includes(user.type)) {
        return <Navigate to="/" replace />;
    }
    console.log("hi")

    return children; // Directly return children here
};

export default RoleBasedRoute;