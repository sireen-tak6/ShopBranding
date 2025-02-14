import React, { useState, useEffect } from "react";
import "./EditProjectRecord.css";
import ClipLoader from "react-spinners/ClipLoader";
import axiosClient from "../../axios-client";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../context/contextProvider";

export default function EditProjectRecord() {
    const { project, record } = useParams();
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const { user } = useStateContext();
    const [area, setArea] = useState();
    const [height, setHeight] = useState();
    const [item, setItem] = useState();
    const [notes, setNotes] = useState();
    const [qty, setQty] = useState();
    const [region, setRegion] = useState();
    const [shopname, setShopname] = useState();
    const [sqm, setSqm] = useState();
    const [width, setWidth] = useState();
    const [status, setStatus] = useState();
    const [errors, setErrors] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getRecord();
    }, [record]);

    const getRecord = async () => {
        setIsLoading(true);
        const response = await axiosClient.get(`/projects/${project}/${record}`);
        setArea(response.data.data.area);
        setHeight(response.data.data.height);
        setItem(response.data.data.item);
        setNotes(response.data.data.notes);
        setQty(response.data.data.qty);
        setRegion(response.data.data.region);
        setShopname(response.data.data.shopname);
        setSqm(response.data.data.sqm);
        setStatus(response.data.data.status);
        setWidth(response.data.data.width);
        setImages(response.data.data.images || []);
        setIsLoading(false);
    };

    const onSubmit = async (ev) => {
        ev.preventDefault();
        setIsLoadingSubmit(true);
        const formData = new FormData();

        const payload = {
            shopname: shopname || null,
            region: region || null,
            area: area || null,
            width: width || null,
            height: height || null,
            qty: qty || null,
            item: item || null,
            sqm: sqm || null,
            status: status || null,
            notes: notes || null,
        };
        for (const key in payload) {
            if(payload[key]!==null && payload[key]!==''){

                formData.append(key, payload[key]);
            }
        }

        images.forEach((image, index) => {
            if (typeof image !== "string") {
                formData.append(`images[${index}]`, image);
            }
        });

        console.log(formData)
        try {
            await axiosClient.post(`/projects/${project}/${record}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then((data) => {
                console.log(data);
                navigate(`/projects/${project}`);
            });
        } catch (err) {
            const response = err.response;
            if (response && response.status === 422) {
                setErrors(response.data.errors);
            }
        } finally {
            setIsLoadingSubmit(false);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            alert("You can only upload up to 3 images.");
            return;
        }
        setImages(files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    return (
        <form id="UpdateRecordForm" onSubmit={onSubmit}>
            <div className="UpdateRecordTitle">تعديل المشروع</div>
            {errors && (
                <div className="alert">
                    {Object.keys(errors).map((key) => (
                        <p key={key}>{errors[key][0]}</p>
                    ))}
                </div>
            )}
            {isLoading ? (
                <div className="CenteredLoader">
                    <ClipLoader color="#000" size={20} />
                </div>
            ) : (
                <>
                    <div className="RowGroup">
                        <div className="UpdateRecordField">
                            <label>اسم المحل:</label>
                            <input
                                type="text"
                                value={shopname}
                                onChange={(e) => setShopname(e.target.value)}
                                disabled={user.type !== "Manager"}
                            />
                        </div>
                        <div className="UpdateRecordField">
                            <label>المحافظة:</label>
                            <input
                                type="text"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                disabled={user.type !== "Manager"}
                            />
                        </div>
                        <div className="UpdateRecordField">
                            <label>المنطقة:</label>
                            <input
                                type="text"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                disabled={user.type !== "Manager"}
                            />
                        </div>
                    </div>

                    <div className="RowGroup">
                        <div className="UpdateRecordField">
                            <label>العنصر:</label>
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => setItem(e.target.value)}
                                disabled={user.type !== "Manager"}
                            />
                        </div>
                        <div className="UpdateRecordField">
                            <label>الطول:</label>
                            <input
                                type="text"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                disabled={user.type !== "Manager"}
                            />
                        </div>
                        <div className="UpdateRecordField">
                            <label>العرض:</label>
                            <input
                                type="text"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                                disabled={user.type !== "Manager"}
                            />
                        </div>
                    </div>

                    <div className="RowGroup">
                        <div className="UpdateRecordField">
                            <label>الكمية:</label>
                            <input
                                type="number"
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}
                                disabled={user.type !== "Manager"}
                            />
                        </div>
                        <div className="UpdateRecordField">
                            <label>المساحة:</label>
                            <input
                                type="text"
                                value={sqm}
                                onChange={(e) => setSqm(e.target.value)}
                                disabled={user.type !== "Manager"}
                            />
                        </div>
                        <div className="UpdateRecordField">
                            <label>الحالة:</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">اختر</option>
                                <option value="قبول">قبول</option>
                                <option value="رفض">رفض</option>
                            </select>
                        </div>
                    </div>

                    <div className="RowGroup">
                        <div className="UpdateRecordField FullWidth">
                            <label>ملاحظات:</label>
                            <input
                                type="text"
                                className="NotesField"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="UpdateRecordField">
                        <label>الصور (Max 3):</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}

                        />
                        <div className="image-preview">
                            {previewImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt="Preview"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        margin: "5px",
                                        borderRadius: "5px",
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={isLoadingSubmit}>
                        {isLoadingSubmit ? (
                            <ClipLoader size={20} color="#fff" />
                        ) : record && (
                            "تعديل"
                        )}
                    </button>
                </>
            )}
        </form>
    );
}
