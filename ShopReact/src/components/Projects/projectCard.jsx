
import React from "react";
import { AiOutlineCalendar } from "react-icons/ai";
import { Link } from "react-router-dom";

//css
import "./projectCard.css";

//images


//providers
export default function ProjectCard({ project, key }) {
    const createdDate = new Date(project.created_at);
    const formattedDate = createdDate.toLocaleDateString();
    return (

        <Link to={`/projects/`+project.id} className="ProjectCard" key={key}>
            <div className="img">
                {project.name}
            </div>
            <div className="Projectdetails">
                <div className="ProjectInfo">
                    <div className="code">
                        <div className="label">
                            الرمز:
                        </div>
                        {project.code}
                    </div>
                    <div className={`code ${project.status == 'In Progress' ? "ProjectStatusProgress" : "ProjectStatusDone"}`}>
                        {project.status=="Done"?"منتهي":"طور التنفيذ"}
                    </div>
                </div>
                <div className="date">
                    <AiOutlineCalendar className="DateIcon" />{" "}
                    <label htmlFor="">{formattedDate}</label>
                </div>
            </div>
        </Link>


    )
}