
import { React, useState, useEffect } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/contextProvider";
import { useNavigate, useParams } from 'react-router-dom';

//css
import "./userList.css";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader.js";

export default function UserList() {
    const [Users, setUsers] = useState(null);
    const navigate = useNavigate();
    const { usersSearch } = useStateContext();

    useEffect(() => {
        if (usersSearch == null) {

            fetchUsers();
        }
        else {
            setUsers(usersSearch)
            console.log(usersSearch)
        }
    }, [usersSearch]);
    const fetchUsers = async () => {
        try {
            const response = await axiosClient.get("/users");
            console.log(response)
            if (response.status === 200) {
                setUsers(response.data.users);
            } else {
            }
        } catch (err) {
        } finally {
        }
    };
    const onDeleteClick = (user) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }
        axiosClient.delete(`/users/${user.id}`).then(() => { fetchUsers() })
    }
    const onEditClick = (user) => {
        navigate(`/users/${user.id}`);
    }
    return (
        <div id="UsersPage">
            <div className="UsersHeader">
                <div className="UsersTitle">
                    المستخدمين
                </div>
                <div className="AddUserButton">
                    <Link to="/users/new" className="button">إضافة مستخدم</Link>
                </div>
            </div>
            {Users ?
                <section className="UsersPart">
                    <div className="card animated UsersTable">
                        <table>
                            <thead>
                                <tr>
                                    <th className="table-cell">ID</th>
                                    <th className="table-cell">اسم المستخدم</th>
                                    <th className="table-cell">الموبايل</th>
                                    <th className="table-cell">كلمة المرور</th>
                                    <th className="table-cell">النوع</th>
                                    <th className="table-cell">تاريخ الإنشاء</th>
                                    <th className="table-cell">تعديل</th>
                                    <th className="table-cell">حذف</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Users.map((user) =>

                                    <tr key={user.id}>

                                        <td className="table-cell">{user.id}</td>
                                        <td className="table-cell">{user.username}</td>
                                        <td className="table-cell">{user.phoneNumber}</td>
                                        <td className="table-cell">{user.plainPassword}</td>
                                        <td className="table-cell">{user.type == "Delegate" ? "مندوب" : user.type == "Agency" ? "وسيط" : user.type == "BTL" ? "مسوق" : user.type == "Installation" ? "عامل" : "مدير"}</td>
                                        <td className="table-cell">{user.created_at}</td>
                                        <td className="table-cell">
                                            <button className="btn-edit" onClick={ev => onEditClick(user)}>تعديل</button>
                                        </td>
                                        <td className="table-cell">
                                            <button className="btn-delete" onClick={ev => onDeleteClick(user)}>حذف</button>
                                        </td>
                                    </tr>)}
                            </tbody>
                        </table>
                    </div>
                </section>
                :
                <div className="CenteredLoader">
                    <ClipLoader color="#000" size={20} />
                </div>
            }
        </div>
    )
}