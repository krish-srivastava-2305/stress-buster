import NotificationList from '@/components/NotificationList'
import Sidebar from '@/components/Sidebar'
import { BackgroundBeams } from '@/components/ui/background-beams'
import React from 'react'

const page = () => {
  return (
    <div className='w-full min-h-screen py-24 flex justify-center items-center'>
        <NotificationList />
      <div className="fixed bg-black -z-10 top-0 left-0 h-full w-full">
        <BackgroundBeams />
      </div>
      <Sidebar tab='Notifications' />
    </div>
  )
}

export default page
