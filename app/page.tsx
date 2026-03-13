import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";
import Projects from "@/components/Projects";
import Navbar from "@/components/Navbar";
import ScrollStorySection from "@/components/ScrollStorySection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main className="bg-deep-black relative">
            <Navbar />

            {/* Scrollytelling Section with Canvas */}
            <section id="home">
                <ScrollyCanvas>
                    <Overlay />
                </ScrollyCanvas>
            </section>

            {/* Cinematic Story Section */}
            <section id="story">
                <ScrollStorySection />
            </section>

            {/* About Reveal Section */}
            <section id="about">
                <AboutSection />
            </section>

            {/* Skills Section with Image Sequence */}
            <section id="skills">
                <SkillsSection />
            </section>

            {/* Experience Journey Map */}
            <section id="experience">
                <ExperienceSection />
            </section>

            {/* Projects Section */}
            <Projects />

            {/* Contact Section */}
            <ContactSection />

            {/* Footer Section */}
            <Footer />
        </main>
    );
}
