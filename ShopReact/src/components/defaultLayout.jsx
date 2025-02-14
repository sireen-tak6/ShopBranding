import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/contextProvider";
import Header from "./Header/Header";


export default function DefaultLayout() {
    const { token, user, setUser, setToken } = useStateContext();

    if (!token || !user) {
        return <Navigate to="/login" />
    }

    return (
        <div id="defaultLayout">
            {user && token && <>
                <Header />
                <main>
                    <Outlet />
                </main>
            </>}
        </div>
    )
}