// File: app/(public)/layout.tsx
import Navbar from "@/app/components/layout/Navbar"; // Your public navbar
import Footer from "@/app/components/landing/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    );
}