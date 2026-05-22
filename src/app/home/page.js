import Navbar from '@/components/Navbar';
import HeroVideo from '@/components/HeroVideo';
import HeroContent from '@/components/HeroContent';
import HeroWrapper from '@/components/HeroWrapper';
import WhoIsAnnie from '@/components/WhoIsAnnie';
import TwentyFiveThings from '@/components/TwentyFiveThings';
import MomentsAndPhrases from '@/components/MomentsAndPhrases';

export default function HomePage() {
  return (
    <div className="snap-container">
      <HeroWrapper>
        <Navbar />
        <HeroContent />
        <HeroVideo />
      </HeroWrapper>

      <WhoIsAnnie />
      <TwentyFiveThings />
      <MomentsAndPhrases />
    </div>
  );
}