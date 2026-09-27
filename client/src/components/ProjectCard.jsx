import { Link } from "react-router-dom";

export default function ProjectCard({
    repository,
    thumbnail,
}) {

    return (
        <article className="project-card">
            <div className="project-card-content">
                {thumbnail && (
                    <img
                        src={thumbnail}
                        alt={`${repository.name} preview`}
                        loading="lazy"
                        className="project-thumbnail"
                    />
                )}
                <div className="project-card-information">
                    <h2>{repository.name}</h2>

                    <p>
                        {repository.description || "No description available."}
                    </p>

                    <p>
                        <strong>Primary Language:</strong>{" "}
                        {repository.language || "Not specified"}
                    </p>

                    <Link to={`/projects/${repository.name}`} className="project-card-link">
                        View Details
                    </Link>
                </div>
            </div>
        </article>
    );

}