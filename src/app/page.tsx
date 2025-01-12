import CTA from '@/components/global/cta-comp'
import Footer from '@/components/global/footer'
import { FAQAccordion } from '@/components/global/freq-ask-question'
import HeroSection from '@/components/global/hero-section'
import Navbar from '@/components/global/navbar'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div className='min-w-full min-h-screen flex flex-col'>

      <Navbar />
      <HeroSection />
      <CTA />
      <FAQAccordion />

      <Footer />
    </div>
  )
}

export default page