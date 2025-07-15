"use client";

import { testimonials } from "@/app/components/landing/constants";

const Testimonials = () => {
    return (
        <div className="mt-20 tracking-wide">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center my-10 lg:my-20">
                What People are saying
            </h2>
            <div className="flex flex-wrap justify-center">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-4 py-2">
                        {/* Updated classes for dark mode */}
                        <div className="bg-white dark:bg-neutral-900 rounded-md p-6 text-md border border-gray-200 dark:border-neutral-800 font-thin">
                            <p className="text-gray-700 dark:text-white">{testimonial.text}</p> {/* Adjust text color */}
                            <div className="flex mt-8 items-start">
                                <img
                                    className="w-12 h-12 mr-6 rounded-full border border-gray-300 dark:border-neutral-300" // Adjust border color
                                    src={testimonial.image}
                                    alt=""
                                />
                                <div>
                                    <h6 className="text-black dark:text-white">{testimonial.user}</h6>
                                    <span className="text-sm font-normal italic text-gray-500 dark:text-neutral-600"> {/* Adjust text color */}
                                        {testimonial.company}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;