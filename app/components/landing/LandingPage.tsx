import React from 'react';
// import Navbar from '../landing/Navbar';
import HeroSection from './HeroSection.jsx';
import FeatureSection from './FeatureSection.jsx';
import Workflow from './Workflow.jsx';
import Pricing from './Pricing.js';
import Testimonials from './Testimonials.jsx';
import Footer from './Footer.tsx';

const LandingPage = () => {
    return (
        <>
            {/*<Navbar />*/}
            <div className="max-w-7xl mx-auto pt-20 px-6">
                <HeroSection />
                <FeatureSection />
                <Workflow />
                <Pricing />
                <Testimonials />
                <Footer />
            </div>
        </>
    );
};

export default LandingPage;
