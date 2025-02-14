
import { React, useState, useEffect } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/contextProvider";

//css
import "./homeProjects.css";
import ProjectCard from "../../components/Projects/projectCard.jsx";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader.js";

export default function HomeProjects() {
    const [Projects, setProjects] = useState(null);
    const { user,projectsSearch } = useStateContext();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axiosClient.get("/projects");
                console.log(response)
                if (response.status === 200) {
                    setProjects(response.data.projects);
                } else {
                }
            } catch (err) {
            } finally {
            }
        };
        if(projectsSearch==null){

            fetchProjects();
        }
        else{
            setProjects(projectsSearch)
            console.log(projectsSearch)
        }
    }, [projectsSearch]);
    return (
        <div id="HomePage">
            <div className="HomePageHeader">
                <div className="HomePageTitle">
                    المشاريع
                </div>
                {user.type == "Manager" &&
                    <div className="AddProjectButton">
                        <Link to="/projects/new" className="button">إضافة مشروع</Link>
                    </div>}
            </div>
            <section className="ProjectsPart">
                {Projects ?
                    <div className="container grid4">
                        {Projects?.map((project, index) =>
                            <ProjectCard project={project} key={index} />
                        )
                        }
                    </div> :
                    <div className="CenteredLoader">
                        <ClipLoader color="#000" size={20} />
                    </div>}
            </section>
        </div>

    )
}