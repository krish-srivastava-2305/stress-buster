'use client'
import React, { useEffect, useState } from 'react'
import { getUserId } from '@/util/get-user-id'
import { useRouter } from 'next/navigation'
import UserChats from '@/components/UserChats'

const Chat: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  console.log("on Chat page")
  

  useEffect(() => {
    const getUserIdAsync = async () => {
      console.log("finding ID")
      const id = await getUserId()
      if(!id) {
        router.push('/login')
        return
      }
      setUserId(id)
    }
    getUserIdAsync()
  }, [])

  if(!userId) {
    return <div className='h-full w-full flex justify-center items-center'>Loading...</div>
  }

  return (
    <div className='w-full min-h-full flex'>
      <UserChats id={userId}></UserChats>
    </div>
  )
}

export default Chat
