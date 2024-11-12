'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Notification {
  id: string
  userId: string
  content: string
  createdAt: string
}

const NotificationList = () => {
  const [notifications, setNotifications] = useState<Array<Notification>>([])

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await axios.get('/api/user/get-notifications')
        console.log(res.data)
        setNotifications(res.data)
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }
    getNotifications()
  }, [])

  return (
    <div className="w-full max-w-lg mx-auto p-4 space-y-4">
      {notifications.length === 0 ? (
        <p className="text-gray-400">No notifications available.</p>
      ) : (
        notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
            className="p-4 border-b border-gray-800 bg-gray-900 rounded-lg hover:bg-gray-800 transition-all"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-white text-lg">{notification.content}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(notification.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  )
}

export default NotificationList
