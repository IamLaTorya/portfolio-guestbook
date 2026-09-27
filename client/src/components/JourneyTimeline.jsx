import { useState } from "react";

import journeyLevels from "../data/journeyLevels";


export default function JourneyTimeline(){

    // Tracks which level is expanded.
    const [openLevel,setOpenLevel] = useState(null);



    // Opens or closes timeline cards.
    function handleToggle(level){

        setOpenLevel(
            openLevel === level
            ? null
            : level
        );

    }



    return (

        <section className="journey-timeline">


            <h2>
                🚀 Developer Journey
            </h2>



            {journeyLevels.map((journey)=>(


                <article 
                    className="journey-card"
                    key={journey.level}
                >


                    <button
                        className="journey-button"
                        onClick={() => handleToggle(journey.level)}
                    >

                        {openLevel === journey.level
                        ? "▼"
                        : "▶"}

                        {journey.level}: {journey.title}

                    </button>




                    {openLevel === journey.level && (

                        <div className="journey-details">


                            <p>
                                {journey.description}
                            </p>



                            <h3>
                                Technical Checkpoints
                            </h3>



                            <div className="skill-grid">


                                {journey.skills.map((skill)=>(

                                    <div
                                        className="skill-badge"
                                        key={skill.name}
                                    >

                                        {skill.status === "complete" && "✅"}

                                        {skill.status === "powering" && "⚡"}

                                        {skill.status === "locked" && "🔒"}


                                        {skill.name}

                                    </div>

                                ))}


                            </div>


                        </div>

                    )}


                </article>


            ))}


        </section>

    );

}