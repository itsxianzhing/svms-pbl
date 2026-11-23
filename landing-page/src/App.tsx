/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useState} from 'react';
import {MotionConfig} from 'motion/react';
import {CustomCursor} from './components/CustomCursor';
import {Navbar} from './components/Navbar';
import {HeroSection} from './components/HeroSection';
import {ProblemSolutionSection} from './components/ProblemSolutionSection';
import {FeaturesSection} from './components/FeaturesSection';
import {StackedCardsSection} from './components/motion/StackedCardsSection';
import {HorizontalScrollSection} from './components/motion/HorizontalScrollSection';
import {ProductShowcaseSection} from './components/ProductShowcaseSection';
import {HowItWorksSection} from './components/HowItWorksSection';
import {PricingSection} from './components/PricingSection';
import {FaqSection} from './components/FaqSection';
import {BetaNoticeSection} from './components/BetaNoticeSection';
import {ClosingCtaSection} from './components/ClosingCtaSection';
import {Footer} from './components/Footer';
import {DemoModal} from './components/DemoModal';
import {ScrollTransitionManager} from './components/transitions/ScrollTransitionManager';
import {ThemeProvider} from './context/ThemeContext';

export default function App() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const openDemoModal = () => setDemoModalOpen(true);
  const closeDemoModal = () => setDemoModalOpen(false);

  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <ScrollTransitionManager>
          <div className="min-h-screen bg-[#F6F7FB] text-slate-900 dark:bg-[#0B1020] dark:text-[#F8FAFC]">
          <CustomCursor />

          <Navbar onBookDemo={openDemoModal} />

          <main>
            <HeroSection onBookDemo={openDemoModal} />
            <ProblemSolutionSection />
            <FeaturesSection />
            <StackedCardsSection />
            <HorizontalScrollSection onBookDemo={openDemoModal} />
            <ProductShowcaseSection />
            <HowItWorksSection />
            <PricingSection onBookDemo={openDemoModal} />
            <FaqSection />
            <BetaNoticeSection />
            <ClosingCtaSection onBookDemo={openDemoModal} />
          </main>

          <Footer onBookDemo={openDemoModal} />

          <DemoModal open={demoModalOpen} onClose={closeDemoModal} />
        </div>
      </ScrollTransitionManager>
    </MotionConfig>
    </ThemeProvider>
  );
}
