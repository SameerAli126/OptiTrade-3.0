// File: app/components/landing/Workflow.tsx

"use client"; // This is a client component

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
// Correct the import path to be absolute using the working alias
import { checklistItems } from "@/app/components/landing/constants";
// Your asset path should also be absolute from the /public folder
import codeImg from "@/app/assets/code.jpg";

const Workflow = () => {
    // Defensive check to prevent crashing if the import fails
    if (!checklistItems || !Array.isArray(checklistItems)) {
        return null; // or a loading state
    }

    return (
        <div className="mt-20">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center mt-6 tracking-wide">
                Maximize your{" "}
                <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
          Portfolio Returns.
        </span>
            </h2>
            <div className="flex flex-wrap justify-center">
                <div className="p-4 w-full lg:w-1/2">
                    {/* Using Next.js Image component for optimization */}
                    <Image src={codeImg} alt="Coding" />
                </div>
                <div className="pt-12 w-full lg:w-1/2">
                    {checklistItems.map((item, index) => (
                        <div key={index} className="flex mb-12">
                            <div className="text-green-400 mx-6 bg-neutral-900 h-10 w-10 p-2 flex justify-center items-center rounded-full">
                                <CheckCircle2 />
                            </div>
                            <div>
                                <h5 className="mt-1 mb-2 text-xl">{item.title}</h5>
                                <p className="text-md text-neutral-500">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Workflow;