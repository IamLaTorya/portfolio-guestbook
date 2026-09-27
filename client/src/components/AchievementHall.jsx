import { useState } from "react";
import achievements from "../data/achievements";


// Separates certifications from badges.
const certifications = achievements.filter(
    achievement => achievement.type === "Certification"
);


// Separates individual badges and collections.
const badges = achievements.filter(
    achievement =>
        achievement.type === "Badge" ||
        achievement.type === "Badge Collection"
);

export default function AchievementHall() {
    // Controls whether modal is visible.
    const [isOpen, setIsOpen] = useState(false);

    // Controls certification section.
    const [showCertifications, setShowCertifications] = useState(false);

    // Controls badge section.
    const [showBadges, setShowBadges] = useState(false);

    return (

        <section className="achievement-hall">

            <h2>
                🏛️ ToyMind Interactive Achievement Hall
            </h2>


            <p>
                Explore certifications, earned badges, and future quests.
            </p>



            <button
                className="achievement-open-button"
                onClick={() => setIsOpen(true)}
            >

                Enter Achievement Hall ✨

            </button>




            {isOpen && (

                <div className="achievement-overlay">


                    <div className="achievement-modal">


                        <button
                            className="close-button"
                            onClick={() => setIsOpen(false)}
                        >

                            ✕ Close

                        </button>



                        <h2>
                            🏆 Achievement Hall
                        </h2>




                        {/* Certification Section */}

                        <button
                            className="achievement-section-button"
                            onClick={() =>
                                setShowCertifications(!showCertifications)
                            }
                        >

                            {showCertifications ? "▼" : "▶"}

                            🏆 Trophy Room

                        </button>




                        {showCertifications && (

                            <div className="achievement-grid">


                                {certifications.map((achievement) => (


                                    <article
                                        className="achievement-card"
                                        key={achievement.title}
                                    >


                                        <img
                                            src={achievement.image}
                                            alt={`${achievement.title} certificate`}
                                            loading="lazy"
                                        />

                                        <p>
                                            {achievement.title}
                                        </p>


                                    </article>


                                ))}


                            </div>

                        )}





                        {/* Badge Section */}

                        <button
                            className="achievement-section-button"
                            onClick={() =>
                                setShowBadges(!showBadges)
                            }
                        >

                            {showBadges ? "▼" : "▶"}

                            🎮 Badge Gallery

                        </button>





                        {showBadges && (

                            <div className="achievement-grid">


                                {badges.map((achievement) => (


                                    <article
                                        className="achievement-card"
                                        key={achievement.title}
                                    >


                                        <h3>
                                            {achievement.title}
                                        </h3>



                                        {/* Single badge */}

                                        {achievement.image && (

                                            <img
                                                src={achievement.image}
                                                alt={`${achievement.title} badge`}
                                                loading="lazy"
                                            />

                                        )}

                                        {/* Badge collection */}

                                        {achievement.images && (

                                            <div className="badge-collection">


                                                {achievement.images.map(
                                                    (image, index) => (

                                                        <img
                                                            key={index}
                                                            src={image}
                                                            alt={`${achievement.title} badge ${index + 1}`}
                                                            loading="lazy"
                                                        />

                                                    ))}


                                            </div>

                                        )}


                                    </article>


                                ))}


                            </div>

                        )}



                    </div>


                </div>

            )}


        </section>

    );

}