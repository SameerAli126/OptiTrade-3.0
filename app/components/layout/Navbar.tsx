// File: app/components/layout/Navbar.tsx
"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext"; // Correct path to your context

// Updated navItems: "Screener" is now "Services", "Trading" is removed to be handled separately.
const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Learn', href: '/learn' },
  { label: 'About', href: '/about' },
];

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  // The special redirect logic for the "Trading" button
  const handleTradingClick = () => {
    if (isLoading) return; // Prevent clicks while auth state is loading

    if (isAuthenticated) {
      router.push('/dashboard'); // If logged in, go to the main dashboard
    } else {
      router.push('/login'); // If not logged in, go to the login page
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login"); // Redirect after logout
  };

  return (
      <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
        <div className="container px-4 mx-auto relative lg:text-sm">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image className="h-10 w-10 mr-2" src="/logo.png" alt="Logo" width={40} height={40} />
              <span className="text-xl tracking-tight">OptiTrade</span>
            </Link>

            {/* Main navigation items */}
            <ul className="hidden lg:flex ml-14 space-x-12">
              {/* The special "Trading" button */}
              <li>
                <button onClick={handleTradingClick} className="hover:text-neutral-300">
                  Trading
                </button>
              </li>
              {/* The rest of the nav items */}
              {navItems.map((item, index) => (
                  <li key={index}>
                    <Link href={item.href} className="hover:text-neutral-300">{item.label}</Link>
                  </li>
              ))}
            </ul>

            {/* Right side authentication buttons */}
            <div className="hidden lg:flex justify-center space-x-12 items-center">
              {isAuthenticated ? (
                  <button onClick={handleLogout} className="py-2 px-3 border rounded-md">
                    Logout
                  </button>
              ) : (
                  <>
                    <Link href="/login" className="py-2 px-3 border rounded-md">
                      Sign In
                    </Link>
                    <Link
                        href="/signup"
                        className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md"
                    >
                      Create an account
                    </Link>
                  </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <div className="lg:hidden md:flex flex-col justify-end">
              <button onClick={toggleNavbar}>
                {mobileDrawerOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {mobileDrawerOpen && (
              <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
                <ul>
                  <li className="py-4"><button onClick={handleTradingClick}>Trading</button></li>
                  {navItems.map((item) => (
                      <li key={item.href} className="py-4">
                        <Link href={item.href}>{item.label}</Link>
                      </li>
                  ))}
                </ul>
                <div className="flex space-x-6 mt-4">
                  {isAuthenticated ? (
                      <button onClick={handleLogout} className="py-2 px-3 border rounded-md">
                        Logout
                      </button>
                  ) : (
                      <>
                        <Link href="/login" className="py-2 px-3 border rounded-md">Sign In</Link>
                        <Link href="/signup" className="py-2 px-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800">Create an account</Link>
                      </>
                  )}
                </div>
              </div>
          )}
        </div>
      </nav>
  );
};

export default Navbar;