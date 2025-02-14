import React, { useState, useRef, useEffect } from "react";
import "./NewUser.css";
import ClipLoader from "react-spinners/ClipLoader";
import axiosClient from "../../axios-client";
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react"; // Icons for display/hide

export default function NewUser() {
    const { id } = useParams();

    const userNameRef = useRef();
    const [phoneNumber, setPhoneNumber] = useState();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const [userType, setUserType] = useState('');
    const [errors, setErrors] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [area, setArea] = useState("south");
    const isRequired = userType === '';
    const [showPassword, setShowPassword] = useState(false); // Password visibility toggle for password
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Password visibility toggle for confirm password  
    const navigate = useNavigate();
    useEffect(() => {
        if (id) {
            setUserLoading(true)
            axiosClient
                .get(`users/${id}`)
                .then(({ data }) => {
                    console.log(data)
                    userNameRef.current.value = data.data.username || ""; // Set the value for the username field
                    passwordRef.current.value = data.data.plainPassword || ""; // Set the value for the username field
                    confirmPasswordRef.current.value = data.data.plainPassword || ""; // Set the value for the username field
                    setPhoneNumber(data.data.phoneNumber || ""); // Set the value for the phone number field
                    setUserType(data.data.type || ""); // Set the selected user type
                })
                .catch((err) => {
                    console.error(err); // Handle any errors
                })
                .finally(() => {
                    setUserLoading(false)
                    setIsLoading(false);
                });
        }
    }, [id]
    )
    const handleRadioChange = (event) => {
        setUserType(event.target.value);
    };
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

        const payload = {
            username: userNameRef.current.value,
            phoneNumber: phoneNumber,
            password: passwordRef.current.value,
            password_confirmation: confirmPasswordRef.current.value,
            type: userType,
            area: area,
        }
        try {
            if (id) {
                await axiosClient.put(`/users/${id}`, payload).then(() => { navigate('/users') })
            }
            else {

                const { data } = await axiosClient.post("/users", payload);
                navigate('/users');
            }

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
        <form id="NewUserForm" onSubmit={onSubmit}>
            <div className="NewUserTitle">
                {id ? `تعديل ${userNameRef.current?.value}` : "إضافة مستخدم"}
            </div>
            {errors && <div className="alert">
                {Object.keys(errors).map(
                    key => (
                        <p key={key}>{errors[key][0]}</p>
                    )
                )
                }</div>}
            {!userLoading ? <>
                <div className="NewUserField">
                    <label >اسم المستخدم :</label>
                    <input
                        type="text"
                        placeholder="أدخل اسم المستخدم"
                        ref={userNameRef}
                        defaultValue={userNameRef.current?.value}

                        required
                    />
                </div> <div className="NewUserField">
                    <label >الموبايل :</label>
                    <input
                        type="number"
                        placeholder="+964xxxxxxxxxx"
                        minLength={10}
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        required
                    />
                </div>
                <div className="NewUserField">
                    <label>المنطقة:</label>
                    <select
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                    >
                        <option value="">اختر</option>
                        <option value="north">شمال</option>
                        <option value="south">جنوب</option>
                    </select>
                </div>
                <div className="NewUserField">
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
                <div className="NewUserField ">
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
                <div className="NewUserRadios">
                    <div>
                        <div className="NewUserRadio">
                            <input
                                type="radio"
                                id="manager"
                                value="Manager"
                                checked={userType === 'Manager'}
                                onChange={handleRadioChange}
                                required={isRequired}
                            />
                            <label htmlFor="manager">مدير</label>
                        </div>
                        <div className="NewUserRadio">
                            <input
                                type="radio"
                                id="Installation"
                                value="Installation"
                                checked={userType === 'Installation'}
                                onChange={handleRadioChange}
                                required={isRequired}
                            />
                            <label htmlFor="Installation">عامل</label>
                        </div>
                    </div>
                    <div>
                        <div className="NewUserRadio">
                            <input
                                type="radio"
                                id="BTL"
                                value="BTL"
                                checked={userType === 'BTL'}
                                onChange={handleRadioChange}
                                required={isRequired}
                            />
                            <label htmlFor="BTL">مسوق</label>
                        </div>
                        <div className="NewUserRadio">
                            <input
                                type="radio"
                                id="Agency"
                                value="Agency"
                                checked={userType === 'Agency'}
                                onChange={handleRadioChange}
                                required={isRequired}
                            />
                            <label htmlFor="Agency">وسيط</label>
                        </div>
                    </div>
                    <div>
                        <div className="NewUserRadio">
                            <input
                                type="radio"
                                id="Delegate"
                                value="Delegate"
                                checked={userType === 'Delegate'}
                                onChange={handleRadioChange}
                                required={isRequired}
                            />
                            <label htmlFor="Delegate">مندوب</label>
                        </div>
                    </div>
                </div>
                <p>نوع المستخدم: <b>{userType == "Delegate" ? "مندوب" : userType == "Agency" ? "وسيط" : userType == "BTL" ? "مسوق" : userType == "Installation" ? "عامل" : "مدير"}</b></p>
                <button type="submit" disabled={isLoading || isRequired}>
                    {isLoading ? (
                        <ClipLoader size={20} color="#fff" />
                    ) : id ?
                        "تعديل"
                        : "إضافة"}
                </button>
            </> : <ClipLoader size={20} color="black" />
            }
        </form>
    )
}