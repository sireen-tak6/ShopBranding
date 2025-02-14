import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/contextProvider";
import Header from "./Header/Header";

export default function GuestLayout() {
    const { token } = useStateContext();

    if (token) {
        return <Navigate to="/" />;
    }

    return (
        <div id="guestLayout">
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    );
}