import Navbar from '@/components/Navbar';
import HeroVideo from '@/components/HeroVideo';
import HeroContent from '@/components/HeroContent';
import HeroWrapper from '@/components/HeroWrapper';
import WhoIsAnnie from '@/components/WhoIsAnnie';
import TwentyFiveThings from '@/components/TwentyFiveThings';
import MomentsAndPhrases from '@/components/MomentsAndPhrases';
import DidYouKnowQuiz from '@/components/DidYouKnowQuiz';
import TourEnd from '@/components/TourEnd';
import LetterToAnnie from '@/components/LetterToAnnie';

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
      <DidYouKnowQuiz />
      <TourEnd />
      <LetterToAnnie />
    </div>
  );
}