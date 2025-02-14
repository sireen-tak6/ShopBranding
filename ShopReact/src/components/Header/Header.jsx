import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavDropdown, Button } from "react-bootstrap";
import "./Header.css";
import Logo from "./Logo.jpg";
import Notification from "./notification.svg";
import { useStateContext } from "../../context/contextProvider";
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosClient from "../../axios-client";
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
    const { user, token, setUser, setToken, setProjectsSearch, setUsersSearch } = useStateContext();
    const location = useLocation();
    const navigate = useNavigate();

    const [projectQuery, setProjectQuery] = useState("");
    const [userQuery, setUserQuery] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState();

    const onLogout = async ev => {
        ev.preventDefault()
       await  axiosClient.post('/logout')
            .then(() => {
                setToken(null)
                setUser({})
            })
        navigate('/login')
    }

    useEffect(() => {
        if (token && !user?.username) {
            axiosClient.get('/user')
                .then(({ data }) => {
                    setUser(data)
                })
        }
        console.log(token)
        console.log(user)
        const interval = setInterval(() => {
            if (token) {
                notification()
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [])

    const notification = async () => {
        await axiosClient.get('/notifications')
            .then(response => {
                console.log(response.data);
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.unread_count)
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleProjectSearch = (e) => {
        e.preventDefault();
        if (projectQuery.trim() !== "") {
            axiosClient.get(`/projects/search?q=${projectQuery}`)
                .then(({ data }) => {
                    console.log(data)
                    setProjectsSearch(data.projects);
                    if (location.pathname !== "/projects") {
                        navigate("/projects");
                    }
                });
        }
    };

    const handleUserSearch = (e) => {
        e.preventDefault();
        if (userQuery.trim() !== "" && location.pathname === "/users") {
            console.log(userQuery)
            axiosClient.get(`/users/search?q=${userQuery}`)
                .then(({ data }) => {
                    console.log(data)
                    setUsersSearch(data.users)
                });
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        location.pathname === "/users" ? setUserQuery(value) : setProjectQuery(value)
        if (value.trim() === "") {
            location.pathname === "/users" ? setUsersSearch(null) : setProjectsSearch(null)
        }
    };

    const markAsRead = (notificationId) => {
        axiosClient.post(`/notifications/${notificationId}/mark-as-read`)
            .then((data) => {
                console.log(data)
                setNotifications(notifications.filter(notification => notification.notification_id !== notificationId));
            })
            .catch(error => {
                console.error(error);
            });
    };

    const markAllAsRead = () => {
        axiosClient.post(`/notifications/mark-all-as-read`)
            .then((data) => {
                console.log(data)
            })
            .catch(error => {
                console.error(error);
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <Navbar id="Header" expand="lg" fixed="top">
            <Container className="HeaderContent">
                <Navbar.Brand href="/">
                    <img
                        src={Logo}
                        alt="Logo"
                        className="BrandImage"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav3" />

                <Navbar.Collapse id="basic-navbar-nav">
                    {token && <>
                        <Nav className="HeaderLink">
                            <Nav.Link href="/home">الصفحة الرئيسية</Nav.Link>
                            {user.type == "Manager" &&
                                <Nav.Link href="/users">المستخدمين</Nav.Link>
                            }
                        </Nav>
                        <form className="SearchBar" onSubmit={location.pathname === "/users" ? handleUserSearch : handleProjectSearch}>
                            <input
                                type="search"
                                placeholder="بحث"
                                value={location.pathname === "/users" ? userQuery : projectQuery}
                                onChange={(e) => { handleInputChange(e) }}
                            />
                            <button type="submit">بحث</button>
                        </form>
                    </>}
                    <Nav>
                        {token && (
                            <NavDropdown
                                title={<>
                                    {unreadCount && unreadCount > 0 ?
                                        <span className="unreadCount">

                                            {unreadCount && unreadCount > 9 ? "+9" : unreadCount}
                                        </span>:<></>}
                                    <img src={Notification} alt="Notification" className="NotificationIcon" />
                                </>}
                                id="notification-dropdown"
                                className="notification-dropdown-container"

                            >
                                <div className="notifications-dropdown">
                                    {notifications.length > 0 && unreadCount > 0 && <NavDropdown.Item key={-1} className={`notification-item markAllRead`}>

                                        <button
                                            className="mark-all-as-read-button"
                                            onClick={() => markAllAsRead()}
                                        >
                                            قراءة الكل
                                        </button>
                                    </NavDropdown.Item>}
                                    {notifications.length > 0 ? (

                                        notifications.map((notification) => (
                                            <>
                                                <NavDropdown.Item key={notification.id} className={`notification-item ${notification.is_read == 0 && "notRead"}`}>
                                                    <div className="notification-content">
                                                        <div className="notification-message">{notification.message}</div>
                                                    </div>
                                                    <div className="notificationDetails">

                                                        <div className="notification-date">{formatDate(notification.created_at)}</div>
                                                        {notification.is_read == 0 &&
                                                            <button
                                                                className="mark-as-read-button"
                                                                onClick={() => markAsRead(notification.notification_id)}
                                                            >
                                                                تمت القراءة
                                                            </button>}
                                                    </div>
                                                </NavDropdown.Item>
                                                <NavDropdown.Divider /></>

                                        ))

                                    ) : (
                                        <NavDropdown.Item>لا يوجد اشعارات</NavDropdown.Item>
                                    )}

                                </div>

                            </NavDropdown>
                        )}

                        {token && (
                            <NavDropdown title={user.username} id="basic-nav-dropdown" className="custom-dropdown">
                                {user.type == "Manager" && (
                                    <>
                                        <NavDropdown.Item onClick={() => navigate('/users/new')}>إضافة مستخدم جديد</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                    </>
                                )}
                                <NavDropdown.Item onClick={() => navigate('/profile/ChangePassword')} >تغيير كلمة المرور</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={onLogout}>تسجيل خروج</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
                {!token && (
                    <Nav className="HeaderLink">
                        <Nav.Link href="/Login">تسجيل دخول</Nav.Link>
                    </Nav>
                )}
            </Container>
        </Navbar >
    );
}