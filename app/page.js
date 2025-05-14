import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MeetOurTrainers from "@/components/MeetOurTrainers";
import { Pricing } from "@/components/Pricing";
import Stats from "@/components/Stats";
import WhyChoseUs from "@/components/WhyChoseUs";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Stats />
      <WhyChoseUs />
      <MeetOurTrainers />
      <Pricing /> 
      <Footer />     
    </div>
  );
}
