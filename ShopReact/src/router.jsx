import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./views/Login/login";
import NotFound from "./views/notFound";
import HomeProjects from "./views/HomeProjects/homeProjects";
import DefaultLayout from "./components/defaultLayout";
import GuestLayout from "./components/guestLayout";
import NewUser from "./views/NewUser/newUser";
import RoleBasedRoute from "./components/RoleBasedLayout";
import UserList from "./views/UsersList/userList";
import EditProjectRecord from "./views/EditProjectExcel/EditProjectRecord";
import ProjectDetails from "./views/ProjectDetails/projectDetails";
import AddProject from "./views/AddProject/addProject";
import ChangePassword from "./views/ChangePassword/ChangePassword";

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to="/Home" />
            },
            {
                path: '/home',
                element: <HomeProjects />
            },
            {
                path: '/projects/new',
                element: (
                    <RoleBasedRoute allowedRoles={['Manager']} >
                        <AddProject />
                    </RoleBasedRoute >
                )
            },
            {
                path: '/projects',
                element: <HomeProjects />
            },
            {
                path: '/users/new',
                element: (
                    <RoleBasedRoute allowedRoles={['Manager']} >
                        <NewUser key="UserCreate" />
                    </RoleBasedRoute>
                )
            },
            {
                path: '/users/:id',
                element: (
                    <RoleBasedRoute allowedRoles={['Manager']} >
                        <NewUser key="UserUpdate" />
                    </RoleBasedRoute>
                )
            },
            {
                path: '/projects/:id',
                element: (
                    <ProjectDetails />
                )
            },
            {
                path: '/users',
                element: (
                    <RoleBasedRoute allowedRoles={['Manager']} >
                        <UserList />
                    </RoleBasedRoute>
                )
            },
            {
                path: '/projects/:project/edit/:record',
                element: (
                    <RoleBasedRoute allowedRoles={['Manager', 'Installation']} >
                        <EditProjectRecord />
                    </RoleBasedRoute>
                )
            },
            {
                path: '/profile/changePassword',
                element: <ChangePassword />
            },
            
        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },

        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
])

export default router;