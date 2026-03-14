import type { Metadata } from "next";
import { Inter, Syncopate } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
    variable: "--font-inter",
});

const syncopate = Syncopate({
    subsets: ["latin"],
    weight: ["400", "700"],
    display: "swap",
    variable: "--font-syncopate",
});

export const metadata: Metadata = {
    title: "Shourya Singh | Full Stack Developer",
    description: "A high-end scrollytelling portfolio showcasing creative development work.",
    icons: {
        icon: "/favicon.svg",
    },
};

import { CursorProvider } from "@/components/CursorContext";
import Cursor from "@/components/Cursor";
import { LoadingProvider } from "@/components/Preloader";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${syncopate.variable} ${inter.className} font-sans`}>
                <LoadingProvider>
                    <CursorProvider>
                        <Cursor />
                        {children}
                    </CursorProvider>
                </LoadingProvider>
            </body>
        </html>
    );
}
