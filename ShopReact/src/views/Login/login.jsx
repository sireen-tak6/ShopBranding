import React, { useState, useRef } from "react";
import "./login.css";
import ClipLoader from "react-spinners/ClipLoader";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/contextProvider";
import { generateToken, messaging } from "../../firebase";
import { getToken } from "firebase/messaging";

export default function Login() {
    const userNameRef = useRef(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const passwordRef = useRef(null);
    const [errors, setErrors] = useState();
    const { setUser, setToken } = useStateContext();
    const [isLoading, setIsLoading] = useState(false);

    const handlePhoneNumberChange = (event) => {
        const inputValue = event.target.value;
        const regex = /^[0-9]*$/;
        if (regex.test(inputValue) || inputValue === '') {
            setPhoneNumber(inputValue);
        }
    };

    const onSubmit = async (ev) => {
        ev.preventDefault()
        setIsLoading(true);
        const fcm_token = await getToken(messaging, { vapidKey: "BMUJD3a8-6XhoycylyO41PeMN5B3cKhuDR4C1JmrWFuyOmUnUEt4QZQBtoGda--YBW1lBrQvvtrorvCe-kaXHTQ" })

        const payload = {
            username: userNameRef.current.value,
            phoneNumber: phoneNumber,
            password: passwordRef.current.value,
            fcm_token: fcm_token
        }
        try {
            const { data } = await axiosClient.post("/login", payload);
            setUser(data.user);
            setToken(data.token);
        } catch (err) {
            const response = err.response;
            if (response && response.status === 422) {
                setErrors(response.data.errors);
            }
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <form id="LoginForm" onSubmit={onSubmit}>
            <div className="LoginTitle">
                تسجيل الدخول
            </div>
            {errors && <div className="alert">
                {Object.keys(errors).map(
                    key => (
                        <p key={key}>{errors[key][0]}</p>
                    )
                )
                }</div>}
            <div className="LoginField">
                <label >اسم المستخدم :</label>
                <input
                    type="text"
                    placeholder="أدخل اسم المستخدم"
                    ref={userNameRef}
                    required
                />
            </div> <div className="LoginField">
                <label >الموبايل :</label>
                <input
                    type="number"
                    placeholder="+964xxxxxxxxxx"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    required
                />
            </div>
            <div className="LoginField LastField">
                <label >كلمة المرور :</label>
                <input
                    type="password"
                    placeholder="********"
                    ref={passwordRef}
                    required
                />
            </div>
            <button type="submit" disabled={isLoading}>
                {isLoading ? (
                    <ClipLoader size={20} color="#fff" />
                ) : (
                    "تسجيل دخول"
                )}
            </button>
        </form>
    )
}