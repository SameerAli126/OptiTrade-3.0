// File: app/components/landing/FeatureSection.tsx

"use client"; // This must be a client component because it imports from constants.tsx (which is also a client component)

import { features } from "@/app/components/landing/constants"; // Corrected, absolute import path

const FeatureSection = () => {
    // Defensive check: If the import fails for any reason, don't crash the page.
    if (!features || !Array.isArray(features)) {
        return null; // or return a loading skeleton
    }

    return (
        <div className="relative mt-20 border-b border-neutral-800 min-h-[800px]">
            <div className="text-center">
        <span className="bg-neutral-900 text-orange-500 rounded-full h-6 text-sm font-medium px-2 py-1 uppercase">
          Features
        </span>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking-wide">
                    Easily build{" "}
                    <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
            your trading portfolio
          </span>
                </h2>
            </div>
            <div className="flex flex-wrap mt-10 lg:mt-20">
                {features.map((feature, index) => (
                    <div key={index} className="w-full sm:w-1/2 lg:w-1/3">
                        <div className="flex">
                            <div className="flex mx-6 h-10 w-10 p-2 bg-neutral-900 text-orange-700 justify-center items-center rounded-full">
                                {/*
                  This renders the icon directly. It assumes your constants.tsx file stores the icon
                  as a JSX element (e.g., icon: <BotMessageSquare />), which our final version does.
                */}
                                {feature.icon}
                            </div>
                            <div>
                                <h5 className="mt-1 mb-6 text-xl">{feature.text}</h5>
                                <p className="text-md p-2 mb-20 text-neutral-500">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureSection;