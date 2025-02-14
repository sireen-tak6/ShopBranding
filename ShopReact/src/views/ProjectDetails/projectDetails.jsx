import React, { useState, useEffect } from "react";
import "./projectDetails.css";
import axiosClient from "../../axios-client";
import { useNavigate, useParams } from 'react-router-dom';
import { useStateContext } from "../../context/contextProvider";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { arabicFontBase64 } from "./fonts/ArabicFont";
import ClipLoader from "react-spinners/ClipLoader";

export default function ProjectDetails() {
    const { id } = useParams()
    const [Governorates, setGovernorates] = useState();
    const [GovernorateId, setGovernorateId] = useState();
    const [project, setProjectId] = useState();
    const [governoratesLoading, setGovernoratesLoading] = useState(false);
    const [getExcelLoading, setGetExcelLoading] = useState(false);
    const [ExcelLoading, setExcelLoading] = useState(false);
    const [PdfLoading, setPdfLoading] = useState(false);
    const [excelData, setExcelData] = useState();
    const { user } = useStateContext();

    const navigate = useNavigate();

    useEffect(() => {
        fetchGovernorate();
    }, []);
    useEffect(() => {
        fetchExcel();
    }, [GovernorateId]);

    const fetchGovernorate = async () => {
        try {
            setGovernoratesLoading(true)
            const response = await axiosClient.get(`/projects/${id}/governorates`);
            console.log(response)
            if (response.status === 200) {
                setGovernorates(response?.data.governorates);
                setGovernorateId(response?.data?.governorates[0].id)
                setProjectId(response?.data?.project)
            } else {
            }
        } catch (err) {
            console.log(err)

        } finally {
            setGovernoratesLoading(false)
        }
    };
    const fetchExcel = async () => {
        try {
            setGetExcelLoading(true)
            const response = await axiosClient.get(`/projects/${id}/excel/${GovernorateId}`);
            console.log(response)
            if (response.status === 200) {
                setExcelData(response?.data.governoratesWithExcel); // Assuming the data is in the `data.data` field
            } else {
            }
        } catch (err) {
            console.log(err)

        } finally {
            setGetExcelLoading(false)

        }
    };
    const handleGovernorateChange = (governorate) => {
        setGovernorateId(governorate)
    };
    const EditRecord = (governorate) => {
        navigate(`/projects/${id}/edit/${governorate}`);
    };
    const markAsDone = async () => {
        const response = await axiosClient.post(`/approveproject/${id}`);
        console.log(response);
        navigate(`/projects`);


    };
    const downloadExcel = async () => {
        setExcelLoading(true)
        try {
            const response = await axiosClient.get(`/export/${id}/${GovernorateId}`, { responseType: 'blob' });
            if (response.data instanceof Blob) {
                const link = document.createElement('a');
                const url = URL.createObjectURL(response.data); // Convert the blob to a URL
                link.href = url;
                link.download = `${project.name}-${project.code}.xlsx`; // Set the file name for the download
                link.click();

                // Optional: Clean up the object URL after the download
                URL.revokeObjectURL(url);
            } else {
                console.error('Response is not a valid Blob.');
            }
        } catch (error) {
            console.error("Error downloading the Excel file", error);
        }
        setExcelLoading(false)
    }

    const generatePDF = async () => {
        setPdfLoading(true);
        try {
            const response = await axiosClient.post(`/generate-pdf-data/${id}/${GovernorateId}`);

            const pageWidth = 254; // mm (approximately 10 inches)
            const pageHeight = pageWidth * (9 / 16); // Calculate height for 16:9 aspect ratio

            const doc = new jsPDF('l', 'mm', [pageWidth, pageHeight]);
            let yOffset = 20; // Starting Y position
            let xOffset = 10; // Starting X position
            // Inside generatePDF function
            // Inside generatePDF function
            doc.addFileToVFS("Amiri-Regular.ttf", arabicFontBase64);
            doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
            doc.setFont('Amiri');

            const marginTop = 10; // Define top margin for the table to start from
            const imgWidth = 25; // Image width in mm
            const imgHeight = 25; // Image height in mm
            const imagesPerRow = 7; // Number of images per row
            const imageSpacing = 5; // Reduced space between images (in mm)

            let currentRowHeight = 0; // Track the height of the current row for more control over yOffset

            // Process each shop
            for (const [index, shop] of response.data.entries()) {
                if (index > 0) doc.addPage(); // Add a new page for each shop

                // Add shop name at the top of the page
                doc.setFontSize(24);
                doc.text(shop.shopname, pageWidth / 2, marginTop, { align: 'center' });

                // Set yOffset for the table to start at the top of the page
                yOffset = marginTop + 20; // Set yOffset to start just below the shop name

                // Add table
                const headers = ['ShopName', 'Region', 'Area', 'Width', 'Height', 'Qty', 'Item', 'Status', 'Notes'];
                const rows = shop.records.map(record => [
                    shop.shopname,
                    record.region,
                    record.area,
                    record.width,
                    record.height,
                    record.qty,
                    record.item,
                    record.status,
                    record.notes,
                ]);

                doc.autoTable({
                    startY: yOffset, // Start the table from yOffset position
                    head: [headers],
                    body: rows,
                    styles: { font: "Amiri", halign: 'right' },
                });

                yOffset = doc.autoTable.previous.finalY + 10; // Update yOffset after the table

                // Add images in rows
                const imagePromises = shop.images.map(async (image, idx) => {
                    const img = new Image();
                    img.crossOrigin = 'Anonymous'; // Allow cross-origin images
                    img.src = `${image}`; // Use absolute URL

                    return new Promise((resolve) => {
                        img.onload = () => {
                            console.log('Image loaded successfully:', img.src); // Log when image is loaded

                            // Calculate position for the image
                            const rowIndex = Math.floor(idx / imagesPerRow); // Determine which row the image goes in
                            const colIndex = idx % imagesPerRow; // Determine column in the row

                            const posX = xOffset + colIndex * (imgWidth + imageSpacing); // Calculate X position with reduced spacing
                            const posY = yOffset + rowIndex * (imgHeight + imageSpacing); // Calculate Y position with reduced spacing

                            doc.addImage(img, 'JPEG', posX, posY, imgWidth, imgHeight); // Add image at calculated position

                            // Track the height of the current row to adjust yOffset more precisely
                            if (rowIndex > 0) {
                                currentRowHeight = posY + imgHeight + imageSpacing; // Update row height when moving to the next row
                            }

                            resolve();
                        };
                        img.onerror = (err) => {
                            console.error('Image failed to load:', img.src, err); // Log if image fails to load
                            resolve(); // Skip this image and continue
                        };
                    });
                });

                // Wait for all images to load before proceeding
                await Promise.all(imagePromises);

                // Move yOffset to the bottom of the last row of images
                yOffset = currentRowHeight + 10; // Add some extra space after images
            }

            // Save the PDF


            // Save the PDF
            doc.save(`Project_${project.name}_code_${project.code}_Governorate_${GovernorateId}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setPdfLoading(false);
        }
    };




    return (
        <div id="ProjectDetails">
            <div className="GovernoratesPart">
                <h2>
                    المحافظات:
                </h2>
                {!governoratesLoading ?
                    <div className="governoratesList">
                        {Governorates && Governorates.map((governorate, index) => (
                            <button onClick={() => handleGovernorateChange(governorate.id)} className={`GovernorateButton ${GovernorateId == governorate.id && "choosen"}`}>
                                - {governorate.label}
                            </button>
                        ))}
                    </div> : <ClipLoader size={20} color="black" />
                }
            </div>
            {!getExcelLoading ?
                <div className="projectTable">
                    <div className="projectTableHeader">
                        {user?.type == "Manager" &&
                            <>
                                <button onClick={() => downloadExcel()} className="downloadButton">
                                    {ExcelLoading ? "..." : "تحميل اكسل"}
                                </button>
                                <button onClick={() => generatePDF()} className="downloadButton">
                                    {PdfLoading ? "..." : "تحميل التقرير"}
                                </button>
                            </>}
                        <div className="projectTableTitle">
                            {project?.name} ({project?.code})
                        </div>
                        <div>
                            {user?.type == "Manager" && project && project?.status != "Done" &&
                                <>
                                    <button onClick={() => markAsDone()} className="downloadButton">
                                        انتهى
                                    </button>

                                </>}
                        </div>
                    </div>
                    <div className="projectTabelContent">
                        <table>
                            <thead>
                                <tr>
                                    <th className="table-cell">اسم المحل</th>
                                    <th className="table-cell">المحافظة</th>
                                    <th className="table-cell">المنطقة</th>
                                    <th className="table-cell">العرض</th>
                                    <th className="table-cell">الطول</th>
                                    <th className="table-cell">الكمية</th>
                                    <th className="table-cell">العنصر</th>
                                    <th className="table-cell">المساحة</th>
                                    <th className="table-cell">الحالة</th>
                                    <th className="table-cell">ملاحظات</th>
                                    <th className="table-cell">تم التعديل من قبل</th>
                                    <th className="table-cell">تاريخ التعديل</th>
                                    <th className="table-cell">الصور</th>
                                    <th className="table-cell">تعديل</th>
                                </tr>
                            </thead>
                            <tbody>
                                {excelData?.map((file, index) => (
                                    <tr key={index} >
                                        <td className="table-cell">{file.shopname}</td>
                                        <td className="table-cell">{file.region}</td>
                                        <td className="table-cell">{file.area}</td>
                                        <td className="table-cell">{file.width}</td>
                                        <td className="table-cell">{file.height}</td>
                                        <td className="table-cell">{file.qty}</td>
                                        <td className="table-cell">{file.item}</td>
                                        <td className="table-cell">{file.sqm}</td>
                                        <td className={`table-cell ${file.status}`}>{file.status}</td>
                                        <td className="table-cell">{file.notes}</td>
                                        <td className="table-cell">{file.editedBy}</td>
                                        <td className="table-cell">{file.updated_at}</td>
                                        <td className="table-cell">
                                            {file?.images?.map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={`${import.meta.env.VITE_API_BASE_URL}/storage/${img}`}
                                                    alt="Record Image"
                                                    style={{ width: 50, height: 50, cursor: "pointer" }}
                                                    onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL}/storage/${img}`, "_blank")}
                                                />
                                            ))}
                                        </td>
                                        <td className="table-cell"><button onClick={() => EditRecord(file.id)} > تعديل </button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div> : <div className="loader">
                    <ClipLoader size={20} color="black" /></div>}
        </div>
    );

}