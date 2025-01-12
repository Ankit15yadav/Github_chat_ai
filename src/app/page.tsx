import HeroSection from '@/components/global/hero-section'
import Navbar from '@/components/global/navbar'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div className='min-w-full min-h-screen flex flex-col'>

      <Navbar />
      <HeroSection />
    </div>
  )
}

export default page