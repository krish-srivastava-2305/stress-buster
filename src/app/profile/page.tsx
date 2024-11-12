import Profile from '@/components/Profile'
import Sidebar from '@/components/Sidebar'
import { BackgroundBeams } from '@/components/ui/background-beams'
import React from 'react'

const page = () => {
  return (
    <div>
      <div className='w-full py-10 min-h-screen flex justify-center items-center'>
        <Profile />
      <div className="fixed bg-black -z-10 top-0 left-0 h-full w-full">
        <BackgroundBeams />
      </div>
      <Sidebar tab='Profile' />
    </div>
    </div>
  )
}

export default page
