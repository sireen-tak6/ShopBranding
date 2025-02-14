import React, { useState, useEffect, useRef } from 'react';
import "./addProject.css";
import ClipLoader from "react-spinners/ClipLoader";
import Select from 'react-select';
import axiosClient from "../../axios-client";
import { useNavigate } from 'react-router-dom';

export default function AddProject() {
    const NameRef = useRef(null);
    const CodeRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [governoratesLoading, setGovernoratesLoading] = useState(true);
    const [Error, setError] = useState(false);
    const [Governorates, setGovernorates] = useState(null);
    const [selectedGovernorate, setSelectedGovernorate] = useState([{ governorate: null, excel: null }]);
    const [selectedGovernorateCount, setSelectedGovernorateCount] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGovernorates = async () => {
            try {
                const response = await axiosClient.get("/governorates");
                if (response.status === 200) {
                    setGovernorates(response.data.governorates);
                } else {
                }
            } catch (err) {
            } finally {
                setGovernoratesLoading(false);
            }
        };
        fetchGovernorates();
    }, []);

    const handleAddGovernorate = () => {
        setSelectedGovernorate([...selectedGovernorate, { governorate: null, excel: null }]);
        setSelectedGovernorateCount(selectedGovernorateCount + 1)
    };
    const handleRemoveGovernorate = () => {
        if (selectedGovernorateCount > 1) {
            setSelectedGovernorate(selectedGovernorate.slice(0, -1));
            setSelectedGovernorateCount(selectedGovernorateCount - 1)
        }
    };

    const handleGovernorateChange = (value, index) => {
        const updatedGovernorates = [...selectedGovernorate];
        console.log(Governorates[value.id])
        updatedGovernorates[index].governorate = value.id;
        setSelectedGovernorate(updatedGovernorates);
    };

    const handleFileChange = (event, index) => {
        const updatedGovernorates = [...selectedGovernorate];
        updatedGovernorates[index].excel = event.target.files[0];
        setSelectedGovernorate(updatedGovernorates);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        const formData = new FormData();
        formData.append("name", NameRef.current.value);
        formData.append("code", CodeRef.current.value);

        selectedGovernorate.forEach((gov, index) => {
            if (gov.governorate) {
                formData.append(`governorates[${index}][id]`, gov.governorate);
                formData.append(`governorates[${index}][excel]`, gov.excel);
            }
        });

        try {
            const response = await axiosClient.post("/newProject", formData);
            console.log(response)
            if (response.status === 201) {
                navigate('/home');

            } else {
                setError("Failed to create project. Please try again.");
            }
        } catch (err) {
            const response = err.response;
            console.log(err)
            if (response && response.status === 422) {
                setError(response.data.errors);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form id="AddProjectForm" onSubmit={handleSubmit}>
            <div className="AddProjectTitle">
                إضافة مشروع جديد
            </div>
            {Error && <div className="alert">
                {Object.keys(Error).map(
                    key => (
                        <p key={key}>{Error[key][0]}</p>
                    )
                )
                }</div>}
            {!governoratesLoading ? <>
                <div className='ProjectDetails'>
                    <div className="AddProjectField">
                        <label >اسم المشروع :</label>
                        <input
                            type="text"
                            placeholder="أدخل اسم المشروع"
                            ref={NameRef}
                            maxLength={50}
                            required
                        />
                    </div> <div className="AddProjectField">
                        <label >رمز المشروع :</label>
                        <input
                            type="text"
                            placeholder="أدخل رمز المشروع"
                            ref={CodeRef}
                            maxLength={10}
                            required
                        />
                    </div>
                </div>
                <label>المحافظات :</label>
                {Array.apply(null, Array(selectedGovernorateCount)).map((i, index) =>
                    <div className='GovernoratePart ProjectDetails'>
                        {Governorates && Governorates.length > 0 &&
                            <Select options={Governorates} placeholder="اختر" value={Governorates[selectedGovernorate[index].governorate - 1]} onChange={(value) => handleGovernorateChange(value, index)}
                                className="custom-select"
                                classNamePrefix="custom-select" />}
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            required
                            onChange={(event) => handleFileChange(event, index)}
                            id={`ExcelButton-${index}`}
                        />
                    </div>)
                }
                <div className='GovernorateButtons'>
                    <button type="button" onClick={handleAddGovernorate}> إضافة محافظة</button>
                    <button type="button" onClick={handleRemoveGovernorate}> حذف محافظة</button>
                </div>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <ClipLoader size={20} color="#fff" />
                    ) : (
                        "إضافة"
                    )}
                </button>
            </> : <ClipLoader size={20} color="black" />
            }
        </form>

    );
};