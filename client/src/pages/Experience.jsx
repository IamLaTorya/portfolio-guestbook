import AchievementHall from "../components/AchievementHall";
import JourneyTimeline from "../components/JourneyTimeline";

export default function Experience() {
    return (
        <>
            <main className="experience-page">
                <h1>Experience & Skills</h1>

                <JourneyTimeline />
                <AchievementHall />
            </main>
        </>
    );
}