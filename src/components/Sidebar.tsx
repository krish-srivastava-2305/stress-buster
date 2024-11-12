'use client'
import React, { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { FaHome, FaBell, FaEnvelope, FaUser, FaHashtag } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const SidebarButton: React.FC<SidebarItem> = ({ icon }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.05 }}
    className="flex items-center justify-center p-2 rounded-full bg-gray-800 hover:bg-gray-700"
  >
    {icon}
  </motion.div>
);

interface SidebarProps {
  tab: string;
}

const Sidebar: React.FC<SidebarProps> = ({tab} : {tab: string}) => {
  const [activeItem, setActiveItem] = useState(tab);
  const router = useRouter();
  
  useEffect(() => {
    setActiveItem(tab)
  }, [tab])

  const sidebarItems = [
    { icon: <FaHome />, label: 'Home', fwd: '/homepage' },
    { icon: <FaBell />, label: 'Notifications', fwd: '/notifications' },
    { icon: <FaEnvelope />, label: 'Messages' , fwd: '/chat'},
    { icon: <FaUser />, label: 'Profile', fwd: '/profile' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 transform bg-gray-900/90 backdrop-blur-md rounded-full shadow-2xl px-12 py-4 border border-gray-800"
    >
      <div className="flex items-center gap-2">
        {sidebarItems.map((item) => (
          <motion.button
            key={item.label}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {router.push(`${item.fwd}`)}}
            className={`p-3 rounded-full transition-colors ${
              activeItem === item.label
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {item.icon}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
export default Sidebar;
