// File: app/layout.tsx
import type React from "react";
import "./globals.css"; // Your styles
import { Providers } from "./providers"; // Your contexts
// ... other imports like ThemeProvider, Toaster

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <Providers>
            {/* NO NAVBAR OR FOOTER HERE */}
            {children}
        </Providers>
        </body>
        </html>
    );
}