// File: app/components/landing/Footer.tsx

"use client"; // Footer uses links, good to mark as client component

import Link from 'next/link';
// The import path is the most critical part.
// We are using the Next.js path alias '@/' which points to the root of the project (the folder with `package.json`).
import {
  resourcesLinks,
  platformLinks,
  communityLinks
} from "../landing/constants";

const Footer = () => {

  // You can add this line to debug in your browser's console
  // console.log('Imported resourcesLinks:', resourcesLinks);

  // Guard against the error if the import somehow still fails
  if (!resourcesLinks || !platformLinks || !communityLinks) {
    // You can return null or a loading state if the data isn't ready
    // This prevents the app from crashing.
    return <footer className="mt-20 border-t py-10 border-neutral-700">Loading footer...</footer>;
  }

  return (
      <footer className="mt-20 border-t py-10 border-neutral-700">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <h3 className="text-md font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {resourcesLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                        href={link.href}
                        className="text-neutral-300 hover:text-white"
                    >
                      {link.text}
                    </Link>
                  </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-md font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              {platformLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                        href={link.href}
                        className="text-neutral-300 hover:text-white"
                    >
                      {link.text}
                    </Link>
                  </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-md font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              {communityLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                        href={link.href}
                        className="text-neutral-300 hover:text-white"
                    >
                      {link.text}
                    </Link>
                  </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
  );
};

export default Footer;