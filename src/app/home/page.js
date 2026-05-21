import Navbar from '@/components/Navbar';
import HeroVideo from '@/components/HeroVideo';
import HeroContent from '@/components/HeroContent';
import HeroWrapper from '@/components/HeroWrapper';
import WhoIsAnnie from '@/components/WhoIsAnnie';

export default function HomePage() {
  return (
    <>
      <HeroWrapper>
        <Navbar />
        <HeroContent />
        <HeroVideo />
      </HeroWrapper>

      <WhoIsAnnie />
    </>
  );
}