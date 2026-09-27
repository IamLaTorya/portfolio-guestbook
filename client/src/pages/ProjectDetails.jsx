import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import projectMedia from "../data/projectMedia";

export default function ProjectDetails() {
    const { id } = useParams();

    const {
        data,
        isLoading,
        error,
    } = useFetch(
        "https://api.github.com/users/IamLaTorya/repos"
    );

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    // Find the repository that matches the URL parameter
    const repository = data.find(
        (repository) => repository.name === id
    );

    if (!repository) {
        return <p>Project not found.</p>;
    }

    const media = projectMedia[repository.name];

    return (
        <div className="project-details">
            <h1>{repository.name}</h1>

            {media?.demo && (
                <video
                    className="project-demo"
                    src={media.demo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    aria-label={`${repository.name} demo`}
                />
            )}

            <p>{repository.description}</p>

            <p>
                <strong>Primary Language:</strong>{" "}
                {repository.language}
            </p>

            <p>
                <strong>Created Date:</strong>{" "}
                {new Date(repository.created_at).toLocaleDateString()}
            </p>

            <p>
                <strong>Last Updated:</strong>{" "}
                {new Date(repository.updated_at).toLocaleDateString()}
            </p>
            <div className="project-links">
                {repository.homepage && (
                    <a
                        href={repository.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Repository live website"
                    >
                        Visit Live Website
                    </a>
                )}

                <br />

                <a
                    href={repository.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub repository link "
                >
                    View GitHub Repository
                </a>
                <Link to="/projects" className="back-link">
                    &larr; Back to Projects
                </Link>
            </div>
        </div>
    );
}