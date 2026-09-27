import mooncycleDemo from "../assets/mooncycle-demo.mp4"
export default function Home() {
    return (
        <>
            <main className="home-main">
                {/* Hero Section */}
                <section className="hero">
                    <h1>LaTorya Hoyle-Sadler</h1>
                    <h2>Full Stack Software Engineer | Interactive Experience Developer</h2>
                    <p>
                        I create interactive web applications, browser-based games, and educational experiences that combine technology, creativity, and meaningful user interactions.
                        <br />
                        Through ToyMind Interactive, I explore how technology can become more than a tool by creating experiences that encourage curiosity, learning, and discovery.
                    </p>
                </section>
                {/* Featured Project Section */}
                <section className="featured-project">
                    <h2>Featured Project</h2>
                    <h3>Mooncycle Ritual Garden Co. V2</h3>
                    <video
                        className="project-demo"
                        src={mooncycleDemo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        aria-label="Mooncycle Ritual Garden Co. Version 2 project demo video"
                    >
                        Your browser does not support the video tag.
                    </video>
                    <p>
                        Mooncycle Ritual Garden Co. Version 2, is an interactive wellness and gardening experience that combines responsive design, JavaScript functionality, and mini-games to create a meaningful digital experience centered around learning, exploration, and creativity.
                    </p>
                    <a href="https://iamlatorya.github.io/mooncycle-ritual-garden-co-v2/" target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="View Mooncycle Ritual Garden Co. live site">View Project</a>
                </section>
                {/* Core Stack Section */}
                <section className="stack">
                    <h2>Core Stack</h2>
                    <ul className="stack-list">
                        <li>HTML</li>
                        <li>CSS</li>
                        <li>JavaScript</li>
                        <li>React</li>
                        <li>Node.js</li>
                        <li>Express</li>
                        <li>MySQL</li>
                        <li>Git</li>
                        <li>Bootstrap</li>
                        <li>Tailwind CSS</li>
                    </ul>
                </section>
                {/* Metrics Section */}
                <section className="metrics">
                    <h2>Development Highlights</h2>
                    <div>
                        <p> <strong>7+</strong>
                            <br />
                            Web Applications & Interactive Experiences</p>
                    </div>
                </section>
            </main >
        </>
    )
}