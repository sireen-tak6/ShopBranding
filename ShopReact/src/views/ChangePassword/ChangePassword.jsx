import React, { useState, useRef } from "react";
import "./ChangePassword.css";
import ClipLoader from "react-spinners/ClipLoader";
import axiosClient from "../../axios-client";
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react"; 

export default function ChangePassword() {
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const [errors, setErrors] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
    const navigate = useNavigate();

    const onSubmit = async (ev) => {
        ev.preventDefault()
        setIsLoading(true);
        const payload = {
            password: passwordRef.current.value,
            password_confirmation: confirmPasswordRef.current.value,
        }
        try {
            await axiosClient.put(`/user/profile/changePassword`, payload).then(() => { navigate('/users') })

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
        <form id="ChangePasswordForm" onSubmit={onSubmit}>
            <div className="ChangePasswordTitle">
                تغيير كلمة المرور
            </div>
            {errors && <div className="alert">
                {Object.keys(errors).map(
                    key => (
                        <p key={key}>{errors[key][0]}</p>
                    )
                )
                }</div>}
            <div className="ChangePasswordField">
                <label >كلمة المرور :</label>
                <div className=" password-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        minLength={8}
                        ref={passwordRef}
                        required
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                </div>
            </div>
            <div className="ChangePasswordField ">
                <label >تأكيد كلمة المرور :</label>
                <div className="password-container">

                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="********"
                        minLength={8}
                        ref={confirmPasswordRef}
                        required
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                        {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                </div>
            </div>

            <button type="submit" disabled={isLoading}>
                {isLoading ? (
                    <ClipLoader size={20} color="#fff" />
                ) :
                    "حفظ"}
            </button>
        </form>
    )
}