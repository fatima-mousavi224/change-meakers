import Banner from '@/components/common/Banner';

import { Metadata } from 'next';

import OurMission from '@/components/mission-and-impact/OurMission';

import OurVision from '@/components/mission-and-impact/OurVision';
import Participants from '@/components/mission-and-impact/Participants';

export const metadata: Metadata = {
  title: 'Mission & Impact',
  description: 'Mission & Impact of Change Makers of the World'
};

const MissionAndImpact = () => {
  return (
    <section className=''>
      <div className='mt-4 max-w-screen-2xl px-4 mx-auto'>
        <Banner>
          <span>Mission & Impact</span>
        </Banner>
        <OurMission />
        <OurVision />
      </div>
      <Participants />
    </section>
  );
};

export default MissionAndImpact;
