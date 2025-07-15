import HeroSection from '../components/landing/HeroSection';
import FeatureSection from '../components/landing/FeatureSection';
import Workflow from '../components/landing/Workflow';
import Pricing from '../components/landing/Pricing';
import Testimonials from '../components/landing/Testimonials';

export default function LandingPage() {
  return (
      // The pt-20 provides space for the sticky Navbar
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <HeroSection />
        <FeatureSection />
        <Workflow />
        <Pricing />
        <Testimonials />
      </div>
  );
}