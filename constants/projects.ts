export interface ProjectFeature {
    icon: string;
    title: string;
    desc: string;
}

export interface TechLayer {
    layer: string;
    items: string[];
}

export interface ProcessStep {
    index: string;
    label: string;
    heading: string;
    body: string;
}

export interface GalleryItem {
    type: "image" | "video";
    src: string;
    alt: string;
    title: string;
    description: string;
}

export interface SlideItem {
    id: string;
    index?: string;
    label?: string;
    heading?: string;
    body?: string;
    image: string;
    isHero?: boolean;
}

export interface ProjectData {
    title: string;
    subtitle: string;
    category: string;
    year: string;
    role: string;
    client: string;
    duration: string;
    tools: string[];
    repoUrl: string;
    liveUrl: string;
    overview: string;
    problem: string;
    features: ProjectFeature[];
    techStack: TechLayer[];
    process: ProcessStep[];
    heroImage: string;
    gallery: GalleryItem[];
    slides: SlideItem[];
}

export const PROJECT_DATA: Record<string, ProjectData> = {
    roomwati: {
        title: "ROOMWATI",
        subtitle: "Room Rental & Property Listing Platform",
        category: "Full-Stack Web Application",
        year: "2024",
        role: "Full Stack Developer",
        client: "Personal Project",
        duration: "3–4 Weeks",
        tools: ["Node.js", "Express.js", "MongoDB", "EJS", "Bootstrap", "Cloudinary", "Passport.js"],
        repoUrl: "https://github.com/shourya9058/RoomWati/tree/main",
        liveUrl: "https://roomwati.onrender.com/",
        overview:
            "RoomWati is a full-stack room rental platform designed to simplify the process of discovering and listing rental properties. The platform centralizes property data, user authentication, and media storage into a single scalable architecture.",
        problem:
            "The traditional rental search process is fragmented across multiple sources, making it difficult for users to compare properties and manage listings efficiently. RoomWati addresses these challenges by providing a structured listing system with robust search capabilities and secure user authentication.",
        features: [
            { icon: "■", title: "Property Listings System", desc: "Browse detailed property listings with structured information, filtered by location, price, and amenities." },
            { icon: "■", title: "Full CRUD Property Management", desc: "Owners have complete control over listings: create, update, and manage property data through a dedicated dashboard." },
            { icon: "■", title: "Secure Authentication", desc: "Session-based authentication powered by Passport.js ensures that only authorized owners can manage their listings." },
            { icon: "■", title: "Advanced Filtering & Search", desc: "High-performance search logic allowing users to quickly locate properties according to their specific needs." },
            { icon: "■", title: "Cloud Media Storage", desc: "Seamless image integration via Multer and Cloudinary, ensuring fast and reliable delivery of property media." },
            { icon: "■", title: "Responsive UI", desc: "Built with Bootstrap and EJS, providing a consistent and intuitive experience across desktop, and mobile devices." },
        ],
        techStack: [
            { layer: "Frontend", items: ["HTML5", "CSS3", "JavaScript", "EJS Templates", "Bootstrap"] },
            { layer: "Backend", items: ["Node.js", "Express.js", "Passport.js"] },
            { layer: "Database", items: ["MongoDB", "Mongoose ODM"] },
            { layer: "Cloud Services", items: ["Cloudinary", "Multer", "Render"] },
        ],
        process: [
            {
                index: "01",
                label: "Architecture",
                heading: "Scalable MVC Design.",
                body: "Engineered using Model-View-Controller patterns to ensure maintainable code and clear separation of concerns across the stack.",
            },
            {
                index: "02",
                label: "Challenges",
                heading: "Auth & Cloud Logic.",
                body: "Solved complex authentication flows with Passport.js and optimized the image upload pipeline using Multer and Cloudinary APIs.",
            },
            {
                index: "03",
                label: "Result",
                heading: "Production-Ready Platform.",
                body: "Delivers a robust rental ecosystem that demonstrates strong proficiency in full-stack architecture and third-party service integration.",
            },
        ],
        heroImage: "/Roomwati/RoomWati Trailer.mp4",
        gallery: [
            { type: "image", src: "/Roomwati/Home.png", alt: "Homepage", title: "Discover Properties", description: "Search and browse modern remote-friendly stays." },
            { type: "image", src: "/Roomwati/listingPage.png", alt: "Listings", title: "Advanced Filters", description: "Find the perfect room with categories and pricing." },
            { type: "image", src: "/Roomwati/listingDetail.png", alt: "Property Detail", title: "Property Details", description: "View high-res photos, amenities, and host reviews." },
            { type: "image", src: "/Roomwati/signInForm.png", alt: "Sign Up", title: "Seamless Onboarding", description: "Quick and secure user registration process." },
            { type: "image", src: "/Roomwati/userDashboard.png", alt: "User Dashboard", title: "User Profiles", description: "Manage bookings, favorites, and account details." },
        ],
        slides: [
            { id: "slide-hero", isHero: true, image: "/Roomwati/RoomWati Trailer.mp4" },
            { id: "slide-desc", index: "00", label: "Overview", heading: "Room rentals,\nreimagined.", body: "A centralized platform built full-stack from the ground up.", image: "/Roomwati/RoomwatiHero.png" },
        ],
    },
    "feelit": {
        title: "FEELIT",
        subtitle: "Interactive Web Music Player",
        category: "Frontend Web Application",
        year: "2024",
        role: "Frontend Developer",
        client: "Personal Project",
        duration: "2 Weeks",
        tools: ["HTML5", "CSS3", "JavaScript (ES6+)", "Web Audio API", "Font Awesome"],
        repoUrl: "https://github.com/shourya9058/Feelit",
        liveUrl: "https://feelit-music-player.onrender.com/",
        overview:
            "Feelit is a browser-based music player built entirely with vanilla JavaScript that replicates the core interaction patterns of modern streaming platforms. It focuses on a custom audio playback engine and responsive UI without relying on heavy frameworks.",
        problem:
            "Most modern web music players depend heavily on large frameworks, increasing bloat and reducing performance. Feelit answers this by implementing a minimal yet fully functional audio player architecture using pure JavaScript.",
        features: [
            { icon: "■", title: "Seamless Playback", desc: "Uses native HTML5 Audio API for efficient, zero-latency playback and track switching." },
            { icon: "■", title: "Interactive Seekbar", desc: "A custom seekbar system that tracks current position and allows real-time dynamic navigation." },
            { icon: "■", title: "Volume Control System", desc: "Fully interactive volume slider for instant adjustment without interrupting the audio output." },
            { icon: "■", title: "Dynamic Playlist", desc: "Scrollable playlist interface for selecting tracks and viewing the currently playing song in real time." },
            { icon: "■", title: "Theme Engine", desc: "Modular light and dark theme toggle system implemented using CSS variables and centralized design logic." },
            { icon: "■", title: "Modern Glassmorphism", desc: "Visually engaging interface featuring blurred backgrounds, smooth animations, and responsive layouts." },
        ],
        techStack: [
            { layer: "Architecture", items: ["HTML5 Semantic Markup", "Modular Design"] },
            { layer: "Design", items: ["CSS3 Custom Properties", "Glassmorphism", "Animations"] },
            { layer: "Logic", items: ["JavaScript ES6+", "DOM Manipulation", "Event Driven"] },
            { layer: "Engine", items: ["HTML5 Audio API", "Web Audio API Interface"] },
        ],
        process: [
            {
                index: "01",
                label: "UI Architecture",
                heading: "Component-Style Layout.",
                body: "Built using modular systems where each UI element functions independently, ensuring the interface remains easy to maintain.",
            },
            {
                index: "02",
                label: "Audio Engine",
                heading: "HTML5 Audio Object.",
                body: "The core logic is controlled via native APIs, allowing direct manipulation of audio states and automatic seekbar updates.",
            },
            {
                index: "03",
                label: "Optimization",
                heading: "Strict No-Framework Policy.",
                body: "Ensures minimal bundle size and faster load times by leveraging fundamental web technologies instead of heavy dependencies.",
            },
        ],
        heroImage: "/FeelIt/Feelit Trailer.mp4",
        gallery: [
            { type: "image", src: "/FeelIt/FeelItHero.png", alt: "Music Player UI", title: "Feel the Rhythm", description: "A minimalist interface focused on the music." },
            { type: "image", src: "/FeelIt/ThemeDark.png", alt: "Dark Theme", title: "Industrial Dark", description: "Seamless industrial aesthetics for low-light environments." },
            { type: "image", src: "/FeelIt/ThemeLight.png", alt: "Light Theme", title: "High Contrast", description: "Pure, high-fidelity light mode for maximum clarity." },
            { type: "image", src: "/FeelIt/Form.png", alt: "Search Interface", title: "System Logic", description: "Intuitive search and filtering across your music library." },
        ],
        slides: [
            { id: "slide-hero", isHero: true, image: "/FeelIt/Feelit Trailer.mp4" },
            { id: "slide-desc", index: "00", label: "Overview", heading: "Sound.\nRe-visualized.", body: "A modern, minimalist, and fully responsive web-based music experience.", image: "/FeelIt/FeelItHero.png" },
        ],
    },

    "astralock": {
        title: "ASTRALOCK",
        subtitle: "Website Protection Browser Extension",
        category: "Browser Extension / Security Tool",
        year: "2024",
        role: "Extension Developer",
        client: "Personal Project",
        duration: "~3 Weeks",
        tools: ["JavaScript", "Chrome Extension API", "HTML5", "CSS3", "SHA-256", "Local Storage"],
        repoUrl: "#",
        liveUrl: "#",
        overview:
            "AstraLock is a browser extension designed to protect access to sensitive or distracting websites by adding a password-based authentication layer directly inside the browser. It intercepts access and requires authentication before allowing the page to load.",
        problem:
            "Browsers allow instant access to previously opened websites, which can expose personal data on shared devices. AstraLock addresses this by introducing a lightweight browser-level protection mechanism with mandatory authentication.",
        features: [
            { icon: "■", title: "Website Password Protection", desc: "Users can lock specific websites with a password, overlaying a lock screen until authentication is successful." },
            { icon: "■", title: "Custom URL Locking", desc: "Flexibly define which websites should be protected by adding them to a secure site registry." },
            { icon: "■", title: "Session-Based Access", desc: "Maintains temporary session states after authentication to prevent repeated prompts while the tab remains active." },
            { icon: "■", title: "Navigation Detection", desc: "Actively monitors reloads, navigation changes, and new tabs to ensure the lock screen cannot be bypassed." },
            { icon: "■", title: "Secure Password Storage", desc: "Passwords are salted and hashed using SHA-256 before being saved locally, ensuring high-level data privacy." },
            { icon: "■", title: "Lightweight Architecture", desc: "Built with optimized minimal scripts to ensure zero impact on browser performance or overhead." },
        ],
        techStack: [
            { layer: "Extension", items: ["Chrome Extension API (V3)", "Background Scripts"] },
            { layer: "UI/UX", items: ["HTML5", "CSS3", "Injected DOM Overlays"] },
            { layer: "Security", items: ["SHA-256 Cryptography", "Session Logic"] },
            { layer: "Persistence", items: ["Chrome Local Storage", "State Management"] },
        ],
        process: [
            {
                index: "01",
                label: "Architecture",
                heading: "Injection & Detection.",
                body: "Utilized background and content scripts to intercept page loads and determine protection status before content is revealed.",
            },
            {
                index: "02",
                label: "Auth Logic",
                heading: "Cryptographic Vault.",
                body: "Implemented SHA-256 hashing for password comparison, ensuring that sensitive credentials are never stored in plain text.",
            },
            {
                index: "03",
                label: "Session",
                heading: "Seamless Protection.",
                body: "Developed a session tracking mechanism that balances high-security requirements with a non-intrusive user experience.",
            },
        ],
        heroImage: "/Astralock/Astralock Trailer.mp4",
        gallery: [
            { type: "image", src: "/Astralock/AstralockHero.png", alt: "AstraLock UI", title: "Maximum Privacy", description: "The core interface for managing protected websites." },
            { type: "image", src: "/Astralock/HomeScreen.png", alt: "Home Screen", title: "Secure Dashboard", description: "Minimalist dashboard for adding and removing URLs." },
            { type: "image", src: "/Astralock/ProtectiveLayer.png", alt: "Lock Screen", title: "The Vault", description: "The secure authentication overlay that blocks unauthorized access." },
            { type: "image", src: "/Astralock/SecuredSites.png", alt: "Listing", title: "Protected Registry", description: "Review and manage all sites currently under AstraLock protection." },
        ],
        slides: [
            { id: "slide-hero", isHero: true, image: "/Astralock/Astralock Trailer.mp4" },
            { id: "slide-desc", index: "00", label: "Overview", heading: "Lock Your Web.\nOwn Your Privacy.", body: "A specialized security extension that adds a protective layer to your browser.", image: "/Astralock/AstralockHero.png" },
        ],
    },
    "anon": {
        title: "ANON",
        subtitle: "Modern E-Commerce Website Interface",
        category: "Frontend Development",
        year: "2024",
        role: "Frontend Developer",
        client: "Personal Project",
        duration: "~2 Weeks",
        tools: ["HTML5", "CSS3", "JavaScript (ES6)", "Flexbox", "CSS Grid"],
        repoUrl: "https://github.com/shourya9058/Anon-E-commerce-Website",
        liveUrl: "https://shourya9058.github.io/Anon-E-commerce-Website/",
        overview:
            "Anon is a modern e-commerce website interface designed to simulate a real shopping platform. It focuses on clean visual hierarchy, responsive layout systems, and interactive UI components.",
        problem:
            "Many beginner interfaces suffer from clutter and poor discovery logic. Anon explores how a structured component system and strategic whitespace can enhance the overall product browsing experience.",
        features: [
            { icon: "■", title: "Responsive Layout System", desc: "Built with Flexbox and CSS Grid to ensure a fluid experience across desktop, tablet, and mobile devices." },
            { icon: "■", title: "Product Card Components", desc: "Modular, reusable cards featuring hover states, discount badges, and smooth visual feedback for users." },
            { icon: "■", title: "Category Navigation", desc: "Structured navigation logic for exploring products across clothing, footwear, and accessories efficiently." },
            { icon: "■", title: "Promotional Sections", desc: "High-impact banners and featured highlights designed to guide user engagement toward trending products." },
            { icon: "■", title: "Interactive UI Elements", desc: "JavaScript-powered attributes such as menu toggles and dynamic navigation behavior for enhanced usability." },
            { icon: "■", title: "Visual Hierarchy", desc: "Focused on an 'editorial approach' with clear spacing and typography to drive conversion and engagement." },
        ],
        techStack: [
            { layer: "Structure", items: ["HTML5 Semantic Tags", "Modular Blocks"] },
            { layer: "Design", items: ["CSS3 Flexbox", "CSS Grid", "Custom Animations"] },
            { layer: "Logic", items: ["JavaScript ES6", "DOM Event Listeners"] },
            { layer: "Optimization", items: ["Mobile-First Approach", "Code Cleanliness"] },
        ],
        process: [
            {
                index: "01",
                label: "Layout",
                heading: "Component Architecture.",
                body: "Structured the UI using independent blocks like product grids and banners to ensure the interface is easy to maintain and scale.",
            },
            {
                index: "02",
                label: "Strategy",
                heading: "Mobile-First UX.",
                body: "Followed a core responsive design methodology to ensure consistent behavior and visual clarity across all modern screen resolutions.",
            },
            {
                index: "03",
                label: "Hierarchy",
                heading: "Visual Clarity.",
                body: "Prioritized clean aesthetics and structured spacing to help users scan products quickly, demonstrating professional e-commerce patterns.",
            },
        ],
        heroImage: "/Anon E-Commerce/Anon Trailer.mp4",
        gallery: [
            { type: "image", src: "/Anon E-Commerce/image.png", alt: "Home Page", title: "Visual Catalog", description: "Modern product grid with high-resolution imagery." },
            { type: "image", src: "/Anon E-Commerce/image copy.png", alt: "Categories", title: "Smart Filtering", description: "Category-based navigation for seamless exploration." },
            { type: "image", src: "/Anon E-Commerce/image copy 2.png", alt: "Promotions", title: "Strategic Offers", description: "High-impact banners for trending fashion highlights." },
            { type: "image", src: "/Anon E-Commerce/image copy 3.png", alt: "Product Detail", title: "Interaction Focus", description: "Clean product views with focused call-to-action logic." },
        ],
        slides: [
            { id: "slide-hero", isHero: true, image: "/Anon E-Commerce/Anon Trailer.mp4" },
            { id: "slide-desc", index: "00", label: "Overview", heading: "Shop Smart.\nStyle Your Life.", body: "A modern, minimalist, and fully responsive e-commerce experience.", image: "/Anon E-Commerce/AnonHero.png" },
        ],
    },
};
